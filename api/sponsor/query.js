export function sponsorsList ([a,b,c,d,e,f], srcText) {
    return `SELECT 
            evs.id,
            evs.sponsor_id,
            s.sponsor_company,
            s.name,
            s.designation,
            s.contact_number,
            st.name as type
        FROM
            event_sponsors AS evs
                INNER JOIN
            sponsors AS s ON evs.sponsor_id = s.id
                INNER JOIN
            sponsor_types AS st ON st.id = evs.type
        WHERE
            evs.deleted_at IS NULL
                AND s.company_id = ${a}
                AND evs.event_id = ${b}
                ${srcText ? ` AND (
                    s.name LIKE '%${srcText}%' OR 
                    s.sponsor_company LIKE '%${srcText}%' OR 
                    s.designation LIKE '%${srcText}%' OR 
                    s.contact_number LIKE '%${srcText}%') ` 
                : ''}
        ${e ? ` ORDER BY ${e} ${f} ` : ''}
        LIMIT ${c} OFFSET ${d}`
}

export function sponsorsCount ([a,b], srcText) {
    return `SELECT 
            count(evs.id) as count 
        FROM
            event_sponsors AS evs
                INNER JOIN
            sponsors AS s ON evs.sponsor_id = s.id
        WHERE
            evs.deleted_at IS NULL
                AND s.company_id = ${a}
                AND evs.event_id = ${b}
                ${srcText ? ` AND (
                    s.name LIKE '%${srcText}%' OR 
                    s.sponsor_company LIKE '%${srcText}%' OR 
                    s.designation LIKE '%${srcText}%' OR 
                    s.contact_number LIKE '%${srcText}%') ` 
                : ''}`
}