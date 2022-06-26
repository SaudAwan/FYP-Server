export function vendorsList([a,b,c,d,e,f], srcText) {
    return `
        SELECT 
            ev.id,
            ev.vendor_id,
            ev.status,
            v.name,
            v.contact_number 
        FROM
            event_vendors AS ev
                INNER JOIN
            vendors AS v ON ev.vendor_id = v.id
        WHERE
            ev.deleted_at IS NULL
                AND v.company_id = ${a}
                AND ev.event_id = ${b}
                ${srcText ? ` AND (
                    v.name LIKE '%${srcText}%' OR 
                    ev.status LIKE '%${srcText}%' OR 
                    v.contact_number LIKE '%${srcText}%') ` 
                : ''}
        ${e ? ` ORDER BY ${e} ${f} ` : ''}
        LIMIT ${c} OFFSET ${d}
    `;
}

export function vendorsCount([a,b], srcText) {
    return `
        SELECT 
            count(ev.id) as count
        FROM
            event_vendors AS ev
                INNER JOIN
            vendors AS v ON ev.vendor_id = v.id
        WHERE
            ev.deleted_at IS NULL
                AND v.company_id = ${a}
                AND ev.event_id = ${b}
                ${srcText ? ` AND (
                    v.name LIKE '%${srcText}%' OR 
                    ev.status LIKE '%${srcText}%' OR 
                    v.contact_number LIKE '%${srcText}%') ` 
                : ''}
    `;
}