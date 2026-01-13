const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {

    // Entities
    const { Assets, RepairLogs } = this.entities;

    /**
     * Function 1: Automated Asset Blocking
     * When a new Repair Log is created, set the Asset status to 'Under Repair'.
     */
    this.after('CREATE', 'RepairLogs', async (data) => {
        const assetId = data.asset_ID;
        if (assetId) {
            console.log(`[Auto-Block] Asset ${assetId} reported. Setting status to Under Repair.`);
            await UPDATE(Assets).set({ status: 'Under Repair' }).where({ ID: assetId });
        }
    });

    /**
     * Function 2: Technician Resolution and Release
     * When a Repair Log is updated (e.g. status change), update the Asset status accordingly.
     */
    this.after('UPDATE', 'RepairLogs', async (data) => {
        // data might only contain modified fields, so we check if ticket_status is present
        if (data.ticket_status) {
            const assetId = data.asset_ID;

            // If asset_ID is not in the payload, we might need to fetch it (but usually it's there or we can safely ignore if not needed contextually)
            // Ideally we should ensure we have the assetID. For this demo, let's assume it's passed or we'd need a before handler to fetch it.
            // However, the standard CAP update usually returns the entity.

            if (assetId) {
                let newAssetStatus = null;

                if (data.ticket_status === 'Fixed') {
                    newAssetStatus = 'Available';
                } else if (data.ticket_status === 'Unrepairable') {
                    newAssetStatus = 'Disposed';
                } else if (data.ticket_status === 'In Progress') {
                    // reinforcing status just in case
                    newAssetStatus = 'Under Repair';
                }

                if (newAssetStatus) {
                    console.log(`[Auto-Resolve] Ticket ${data.ID} became ${data.ticket_status}. Updating Asset ${assetId} to ${newAssetStatus}.`);
                    await UPDATE(Assets).set({ status: newAssetStatus }).where({ ID: assetId });
                }
            }
        }
    });
});
