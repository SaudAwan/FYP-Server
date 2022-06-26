export function inventoryList([a,b,c,d,e,f], srcText) {
    return `
        SELECT 
            id,
            item,
            quantity,
            status,
            location
        FROM
            event_inventory
        WHERE
            deleted_at IS NULL
                AND company_id = ${a}
                AND event_id = ${b}
                ${srcText ? ` AND (
                    item LIKE '%${srcText}%' OR 
                    quantity LIKE '%${srcText}%' OR 
                    location LIKE '%${srcText}%' OR 
                    status LIKE '%${srcText}%') ` 
                : ''}
        ${e ? ` ORDER BY ${e} ${f} ` : ''}
        LIMIT ${c} OFFSET ${d}
    `;
}

export function inventoryCount([a,b], srcText) {
    return `
        SELECT 
            count(id) as count
        FROM
            event_inventory
        WHERE
            deleted_at IS NULL
                AND company_id = ${a}
                AND event_id = ${b}
                ${srcText ? ` AND (
                    item LIKE '%${srcText}%' OR 
                    quantity LIKE '%${srcText}%' OR 
                    location LIKE '%${srcText}%' OR 
                    status LIKE '%${srcText}%') ` 
                : ''}
    `;
}