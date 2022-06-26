export function mediaPartnersList([a, b, c, d, e, f], srcText) {
    return `
        SELECT 
            emp.id,
            emp.media_partner_id,
            mp.company_id,
            mp.name,
            mp.media_partner_company,
            mp.contact_number,
            mp.email
        FROM
            event_media_partners AS emp
                INNER JOIN
            media_partners AS mp ON emp.media_partner_id = mp.id
        WHERE
            emp.deleted_at IS NULL
                AND mp.company_id = ${a}
                AND emp.event_id = ${b}
                ${srcText ? ` AND (
                    mp.name LIKE '%${srcText}%' OR 
                    mp.media_partner_company LIKE '%${srcText}%' OR 
                    mp.email LIKE '%${srcText}%' OR 
                    mp.contact_number LIKE '%${srcText}%') ` 
                : ''}
        ${e ? ` ORDER BY ${e} ${f} ` : ''}
        LIMIT ${c} OFFSET ${d}
    `;
}

export function mediaPartnersCount([a, b], srcText) {
    return `
        SELECT 
            count(emp.id) as count
        FROM
            event_media_partners AS emp
                INNER JOIN
            media_partners AS mp ON emp.media_partner_id = mp.id
        WHERE
            emp.deleted_at IS NULL
                AND mp.company_id = ${a}
                AND emp.event_id = ${b}
                ${srcText ? ` AND (
                    mp.name LIKE '%${srcText}%' OR 
                    mp.media_partner_company LIKE '%${srcText}%' OR 
                    mp.email LIKE '%${srcText}%' OR 
                    mp.contact_number LIKE '%${srcText}%') ` 
                : ''}
    `;
}