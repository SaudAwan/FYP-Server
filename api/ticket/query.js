export function ticketsList([a,b,c,d,e,f], srcText) {
    return `
        SELECT 
            et.id,
            et.speaker_id,
            et.contact_number,
            et.flight_status,
            et.accomodation,
            s.name as speaker_name
        FROM
            event_tickets AS et
                INNER JOIN
            speakers AS s ON et.speaker_id = s.id
        WHERE
            et.deleted_at IS NULL
                AND s.company_id = ${a}
                AND et.event_id = ${b}
                ${srcText ? ` AND (
                    s.name LIKE '%${srcText}%' OR 
                    et.flight_status LIKE '%${srcText}%' OR 
                    et.accomodation LIKE '%${srcText}%' OR 
                    et.contact_number LIKE '%${srcText}%') ` 
                : ''}
        ${e ? ` ORDER BY ${e} ${f} ` : ''}
        LIMIT ${c} OFFSET ${d}
    `;
}

export function ticketsCount([a,b], srcText) {
    return `
        SELECT 
            count(et.id) as count
        FROM
            event_tickets AS et
                INNER JOIN
            speakers AS s ON et.speaker_id = s.id
        WHERE
            et.deleted_at IS NULL
                AND s.company_id = ${a}
                AND et.event_id = ${b}
                ${srcText ? ` AND (
                    s.name LIKE '%${srcText}%' OR 
                    et.flight_status LIKE '%${srcText}%' OR 
                    et.accomodation LIKE '%${srcText}%' OR 
                    et.contact_number LIKE '%${srcText}%') ` 
                : ''}
    `;
}