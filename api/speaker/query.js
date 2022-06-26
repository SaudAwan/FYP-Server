export function speakersList([a, b, c, d, e, f], srcText) {
    return `
        SELECT 
            evs.id,
            evs.speaker_id,
            s.name,
            s.designation,
            s.contact_number,
            s.speaker_company,
            evs.status 
        FROM
            event_speakers AS evs
                INNER JOIN
            speakers AS s ON evs.speaker_id = s.id
        WHERE
            evs.deleted_at IS NULL
                AND s.company_id = ${a}
                AND evs.event_id = ${b}
                ${srcText ? ` AND (
                    evs.status LIKE '%${srcText}%' OR 
                    s.name LIKE '%${srcText}%' OR 
                    s.speaker_company LIKE '%${srcText}%' OR 
                    s.designation LIKE '%${srcText}%' OR 
                    s.contact_number LIKE '%${srcText}%') ` 
                : ''}
        ${e ? ` ORDER BY ${e} ${f} ` : ''}
        LIMIT ${c} OFFSET ${d}
    `
}

export function speakersCount([a, b], srcText) {
    return `
        SELECT 
            count(evs.id) as count
        FROM
            event_speakers AS evs
                INNER JOIN
            speakers AS s ON evs.speaker_id = s.id
        WHERE
            evs.deleted_at IS NULL
                AND s.company_id = ${a}
                AND evs.event_id = ${b}
                ${srcText ? ` AND (
                    evs.status LIKE '%${srcText}%' OR 
                    s.name LIKE '%${srcText}%' OR 
                    s.speaker_company LIKE '%${srcText}%' OR 
                    s.designation LIKE '%${srcText}%' OR 
                    s.contact_number LIKE '%${srcText}%') ` 
                : ''}
    `
}