namespace uthm.inventory;
using { managed, cuid } from '@sap/cds/common';

entity Assets : managed, cuid {
    name            : String(100);
    serial_number   : String(50);
    location        : String(50);
    // Status enum: 'Available', 'Under Repair', 'Disposed'
    status          : String(20) default 'Available'; 
    purchase_date   : Date;
    repair_history  : Association to many RepairLogs on repair_history.asset = $self;
}

entity RepairLogs : managed, cuid {
    asset           : Association to Assets; 
    reporter_id     : String(50); 
    description     : String(500);
    damage_photo    : LargeString; 
    // Status enum: 'Pending', 'Fixed', 'Unrepairable'
    ticket_status   : String(20) default 'Pending'; 
    technician_note : String(500);
}
