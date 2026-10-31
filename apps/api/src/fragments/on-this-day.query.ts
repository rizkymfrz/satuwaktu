import { Prisma, type PrismaClient, type Visibility } from '@repo/db';
import { ARCHIVE_TIME_ZONE } from '../config/archive.config.js';

export interface OnThisDayMemory {
  id: string;
  caption: string;
  yearsAgo: number;
}

export async function findOnThisDay(
  db: PrismaClient,
  now: Date,
  visibilities: Visibility[],
): Promise<OnThisDayMemory | null> {
  const [year, month, day] = new Intl.DateTimeFormat('en-CA', {
    timeZone: ARCHIVE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(now)
    .split('-');
  const rows = await db.$queryRaw<OnThisDayMemory[]>`
    SELECT
      "id",
      "caption",
      ${Number(year)}::int - EXTRACT(
        YEAR FROM ("takenAt" AT TIME ZONE 'UTC' AT TIME ZONE ${ARCHIVE_TIME_ZONE})
      )::int AS "yearsAgo"
    FROM "Fragment"
    WHERE "visibility"::text IN (${Prisma.join(visibilities)})
      AND to_char(
        "takenAt" AT TIME ZONE 'UTC' AT TIME ZONE ${ARCHIVE_TIME_ZONE},
        'MM-DD'
      ) = ${`${month}-${day}`}
      AND "takenAt" AT TIME ZONE 'UTC' AT TIME ZONE ${ARCHIVE_TIME_ZONE}
        < ${`${year}-01-01`}::timestamp
    ORDER BY "takenAt" DESC
    LIMIT 1
  `;
  return rows[0] ?? null;
}
