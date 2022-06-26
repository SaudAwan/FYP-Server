export function delegatesList([a,b,c,d,e,f], srcText) {
    return `
        SELECT 
            evd.id,
            evd.delegate_id,
            d.company_id,
            d.delegate_company,
            d.name,
            d.designation,
            d.contact_number,
            dc.name as category
        FROM
            event_delegates AS evd
                INNER JOIN
            delegates AS d ON evd.delegate_id = d.id
                INNER JOIN
            delegate_categories AS dc ON dc.id = evd.category_id
        WHERE
            evd.deleted_at IS NULL
                AND d.company_id = ${a}
                AND evd.event_id = ${b}
                ${srcText ? ` AND (
                    d.name LIKE '%${srcText}%' OR 
                    d.delegate_company LIKE '%${srcText}%' OR 
                    d.designation LIKE '%${srcText}%' OR 
                    d.contact_number LIKE '%${srcText}%') ` 
                : ''}
        ${e ? ` ORDER BY ${e} ${f} ` : ''}
        LIMIT ${c} OFFSET ${d}`
}

export function delegatesCount([a,b], srcText) {
    return `
        SELECT 
            count(evd.id) as count
        FROM
            event_delegates AS evd
                INNER JOIN
            delegates AS d ON evd.delegate_id = d.id
        WHERE
            evd.deleted_at IS NULL
                AND d.company_id = ${a}
                AND evd.event_id = ${b}
                ${srcText ? ` AND (
                    d.name LIKE '%${srcText}%' OR 
                    d.delegate_company LIKE '%${srcText}%' OR 
                    d.designation LIKE '%${srcText}%' OR 
                    d.contact_number LIKE '%${srcText}%') ` 
                : ''}`
}