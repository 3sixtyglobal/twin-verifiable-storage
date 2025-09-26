module verifiable_storage::verifiable_storage {
    use std::string::String;
    use iota::event;

    /// Current version of the verifiable storage contract
    const VERSION: u64 = 1;

    /// Error codes
    const E_UNAUTHORIZED: u64 = 401;
    const E_MAX_ALLOWLIST_EXCEEDED: u64 = 1001;

    /// MigrationState tracks whether migration operations are enabled
    public struct MigrationState has key {
        id: UID,
        enabled: bool,
    }

    /// UpgradeCapRegistry stores reference to upgrade capabilities
    public struct UpgradeCapRegistry has key {
        id: UID,
        upgrade_cap_id: address,
    }

    public struct StorageItem has key, store {
        id: UID,
        version: u64, // Contract version that created this item
        data: String,
        epoch: u64,
        creator: address,
        allowlist: vector<address>,
        max_allowlist_size: u16
    }

    public struct StorageCreated has copy, drop {
        id: address,
        epoch: u64,
        creator: address
    }

    public struct StorageUpdated has copy, drop {
        id: address,
        epoch: u64,
        updater: address
    }

    /// Initialize the contract - creates tooling infrastructure for move-to-json CLI
    fun init(ctx: &mut TxContext) {
        let migration_state = MigrationState {
            id: object::new(ctx),
            enabled: false,
        };
        transfer::share_object(migration_state);

        let upgrade_registry = UpgradeCapRegistry {
            id: object::new(ctx),
            upgrade_cap_id: @0x0,
        };
        transfer::share_object(upgrade_registry);
    }


    /// Get current contract version
    public fun get_version(): u64 { VERSION }

    /// Get storage item version
    public fun get_item_version(item: &StorageItem): u64 { item.version }

    /// Store data with an optional allowlist of additional addresses.
    /// If `extra_allowlist` is provided, those addresses are added to the allowlist.
    public entry fun store_data(data: String, extra_allowlist: vector<address>, max_allowlist_size: u16, ctx: &mut TxContext) {
        let sender = ctx.sender();
        let epoch = ctx.epoch();

        let mut allowlist = vector::empty<address>();
        vector::push_back(&mut allowlist, sender);
        append_unique(&mut allowlist, &extra_allowlist, max_allowlist_size);

        let storage = StorageItem {
            id: object::new(ctx),
            version: VERSION,
            data: data,
            epoch,
            creator: sender,
            allowlist,
            max_allowlist_size
        };

        // Emit event for storage creation
        event::emit(
            StorageCreated {
                id: object::uid_to_address(&storage.id),
                epoch,
                creator: sender
            }
        );

        transfer::share_object(storage);
    }

    /// Update the mutable data of the item.
    public entry fun update_data(storage: &mut StorageItem, data: String, updated_allowlist: vector<address>, remove_allowlist: bool, ctx: &mut TxContext) {
        let sender = ctx.sender();
        assert!(is_inlist(&storage.allowlist, sender), E_UNAUTHORIZED);

        let epoch = ctx.epoch();

        // Only update data if the string length > 0
        if (data.length() > 0) {
            storage.data = data;
        };
        storage.epoch = epoch;

        // Only update allowlist if the length > 0, always including the creator
        let mut allowlist = vector::empty<address>();
        vector::push_back(&mut allowlist, storage.creator);
        if (!remove_allowlist) {
            append_unique(&mut allowlist, &updated_allowlist, storage.max_allowlist_size);
        };
        storage.allowlist = allowlist;

        // Emit event for storage update
        event::emit(
            StorageUpdated {
                id: object::uid_to_address(&storage.id),
                epoch,
                updater: sender
            }
        );
    }	

    /// Permanently delete the StorageItem (only creator can do this).
    public entry fun delete_data(
        storage: StorageItem,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        assert!(sender == storage.creator, E_UNAUTHORIZED);

        let StorageItem {
            id,
            version: _,
            data: _,
            epoch: _,
            creator: _,
            allowlist: _,
            max_allowlist_size: _,
        } = storage;

        object::delete(id);
    }

    // Helper: check if address is in allowlist
    fun is_inlist(allowlist: &vector<address>, addr: address): bool {
        let len = vector::length(allowlist);
        let mut i = 0;
        while (i < len) {
            if (*vector::borrow(allowlist, i) == addr) {
                return true
            };
            i = i + 1;
        };
        false
    }

    // Helper: append unique addresses from src to dest
    fun append_unique(dest: &mut vector<address>, src: &vector<address>, max_size: u16) {
        let len = vector::length(src);
        let mut i = 0;
        while (i < len) {
            let addr = *vector::borrow(src, i);
            if (!is_inlist(dest, addr)) {
                if (vector::length(dest) < (max_size as u64)) {
                    vector::push_back(dest, addr);
                } else {
                    assert!(false, E_MAX_ALLOWLIST_EXCEEDED);
                }
            };
            i = i + 1;
        }
    }
}
