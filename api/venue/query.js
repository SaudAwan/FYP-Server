export function venuesList([a,b,c,d,e,f], srcText) {
    return `
        SELECT 
            ev.id,
            ev.venue_id,
            v.name,
            v.email,
            v.contact_number,
            v.status 
        FROM
            event_venues AS ev
                INNER JOIN
            venues AS v ON ev.venue_id = v.id
        WHERE
            ev.deleted_at IS NULL
                AND v.company_id = ${a}
                AND ev.event_id = ${b}
                ${srcText ? ` AND (
                    v.name LIKE '%${srcText}%' OR 
                    v.email LIKE '%${srcText}%' OR 
                    v.status LIKE '%${srcText}%' OR 
                    v.contact_number LIKE '%${srcText}%') ` 
                : ''}
        ${e ? ` ORDER BY ${e} ${f} ` : ''}
        LIMIT ${c} OFFSET ${d}
    `;
}

export function venuesCount([a,b,c,d,e,f], srcText) {
    return `
        SELECT 
            count(ev.id) as count
        FROM
            event_venues AS ev
                INNER JOIN
            venues AS v ON ev.venue_id = v.id
        WHERE
            ev.deleted_at IS NULL
                AND v.company_id = ${a}
                AND ev.event_id = ${b}
                ${srcText ? ` AND (
                    v.name LIKE '%${srcText}%' OR 
                    v.email LIKE '%${srcText}%' OR 
                    v.status LIKE '%${srcText}%' OR 
                    v.contact_number LIKE '%${srcText}%') ` 
                : ''}
    `;
}