using { uthm.inventory as my } from '../db/schema';

service RepairService {
    @odata.draft.enabled
    entity Assets as projection on my.Assets;
    entity RepairLogs as projection on my.RepairLogs;
}
