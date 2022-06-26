export function assosciationsList([a, b, c, d, e, f], srcText) {
    return `
        SELECT 
            eva.id,
            eva.assosciation_id,
            a.name,
            a.email,
            a.contact_number,
            a.assosciation_company 
        FROM
            event_assosciations AS eva
                INNER JOIN
            assosciations AS a ON eva.assosciation_id = a.id
        WHERE
            eva.deleted_at IS NULL
                AND a.company_id = ${a}
                AND eva.event_id = ${b}
                ${srcText ? ` AND (
                    a.name LIKE '%${srcText}%' OR 
                    a.assosciation_company LIKE '%${srcText}%' OR 
                    a.email LIKE '%${srcText}%' OR 
                    a.contact_number LIKE '%${srcText}%') ` 
                : ''}
        ${e ? ` ORDER BY ${e} ${f} ` : ''}
        LIMIT ${c} OFFSET ${d}
    `
}

export function assosciationsCount([a, b], srcText) {
    return `
        SELECT 
            count(eva.id) as count
        FROM
            event_assosciations AS eva
                INNER JOIN
            assosciations AS a ON eva.assosciation_id = a.id
        WHERE
            eva.deleted_at IS NULL
                AND a.company_id = ${a}
                AND eva.event_id = ${b}
                ${srcText ? ` AND (
                    a.name LIKE '%${srcText}%' OR 
                    a.assosciation_company LIKE '%${srcText}%' OR 
                    a.email LIKE '%${srcText}%' OR 
                    a.contact_number LIKE '%${srcText}%') ` 
                : ''}
    `
}