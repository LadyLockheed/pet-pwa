import styled from 'styled-components';
import type { HeatCycle } from '../types/pet';
import { colors } from '../styles/colors';
import { spacings } from '../styles/spacings';

interface HeatCycleTimelineProps {
	heatCycles: HeatCycle[];
}

const monthLabels = [
	'J',
	'F',
	'M',
	'A',
	'M',
	'J',
	'J',
	'A',
	'S',
	'O',
	'N',
	'D',
];

export default function HeatCycleTimeline({
	heatCycles,
}: HeatCycleTimelineProps) {
	const rows = getTimelineRows(heatCycles);

	if (rows.length === 0) {
		return null;
	}

	return (
		<Timelines>
			{rows.map((row) => (
				<YearRow key={row.year}>
					<YearLabel>{row.year}</YearLabel>
					<CycleSummaries>
						{row.segments.map((segment) =>
							segment.dateRange ? (
								<CycleSummary
									key={`${segment.dateRange}-${segment.startPercent}`}
								>
									<CycleIndicator>
										<HeatDot />
										{segment.dateRange}

										{segment.standingHeatDateRange ? (
											<>
												<StandingDot />
												{segment.standingHeatDateRange}
											</>
										) : null}
									</CycleIndicator>
								</CycleSummary>
							) : null,
						)}
					</CycleSummaries>

					<Track aria-label={`Heat cycle timeline for ${row.year}`}>
						{row.segments.map((segment) => (
							<>
								<HeatRange
									key={`${segment.startPercent}-${segment.endPercent}`}
									style={{
										left: `${segment.startPercent}%`,
										width: `${segment.endPercent - segment.startPercent}%`,
									}}
								/>
								{segment.standingHeatStartPercent !== undefined &&
									segment.standingHeatEndPercent !== undefined && (
										<StandingHeatRange
											key={`standing-${segment.standingHeatStartPercent}`}
											style={{
												left: `${segment.standingHeatStartPercent}%`,
												width: `${segment.standingHeatEndPercent - segment.standingHeatStartPercent}%`,
											}}
											title="Standing heat"
										/>
									)}
							</>
						))}
					</Track>
					<MonthLabels>
						{monthLabels.map((month, index) => (
							<span key={`${month}-${index}`}>{month}</span>
						))}
					</MonthLabels>
				</YearRow>
			))}
			<Legend>
				<span>
					<LegendRange /> In heat
				</span>
				<span>
					<LegendMarker /> Standing
				</span>
			</Legend>
		</Timelines>
	);
}

// Converts the stored YYYY-MM-DD string into a local Date for timeline math.
function parseDate(date?: string) {
	if (!date) {
		return undefined;
	}

	const parsedDate = new Date(`${date}T00:00:00`);

	return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
}

function formatCycleDate(date?: string) {
	const parsed = parseDate(date);
	if (!parsed) return undefined;
	return parsed.toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' });
}

// Groups all heat cycle timeline segments by year so each year gets one row.
function getTimelineRows(heatCycles: HeatCycle[]) {
	const rowsByYear = new Map<
		number,
		{
			year: number;
			segments: Array<{
				startPercent: number;
				endPercent: number;
				standingHeatStartPercent?: number;
				standingHeatEndPercent?: number;
				dateRange?: string;
				standingHeatDateRange?: string;
			}>;
		}
	>();

	heatCycles.forEach((heatCycle) => {
		getTimelineSegments(heatCycle).forEach((segment) => {
			const row = rowsByYear.get(segment.year) ?? {
				year: segment.year,

				segments: [],
			};

			row.segments.push(segment);
			rowsByYear.set(segment.year, row);
		});
	});

	return Array.from(rowsByYear.values()).sort((firstRow, secondRow) => {
		return secondRow.year - firstRow.year;
	});
}

// Splits one heat cycle into one or more yearly segments for the timeline.
function getTimelineSegments(heatCycle: HeatCycle) {
	const startDate = parseDate(heatCycle.startDate);
	const endDate = parseDate(heatCycle.endDate) ?? startDate;
	const standingHeatStartDate = parseDate(heatCycle.standingHeatStartDate);
	const standingHeatEndDate =
		parseDate(heatCycle.standingHeatEndDate) ?? standingHeatStartDate;
	const dateRange = formatDateRange(heatCycle.startDate, heatCycle.endDate);
	const standingHeatDateRange = formatDateRange(
		heatCycle.standingHeatStartDate,
		heatCycle.standingHeatEndDate,
	);

	if (!startDate || !endDate) {
		return [];
	}

	const firstYear = startDate.getFullYear();
	const lastYear = endDate.getFullYear();

	return Array.from({ length: lastYear - firstYear + 1 }, (_, index) => {
		const year = firstYear + index;

		const visibleMain = getVisibleDateRange(startDate, endDate, year);
		if (!visibleMain) return null;

		const visibleStandingHeat =
			standingHeatStartDate && standingHeatEndDate
				? getVisibleDateRange(standingHeatStartDate, standingHeatEndDate, year)
				: undefined;

		return {
			year,
			startPercent: getYearProgress(visibleMain.start),
			endPercent: Math.max(
				getYearProgress(visibleMain.end),
				getYearProgress(visibleMain.start) + 2,
			),
			standingHeatStartPercent: visibleStandingHeat
				? getYearProgress(visibleStandingHeat.start)
				: undefined,
			standingHeatEndPercent: visibleStandingHeat
				? Math.max(
						getYearProgress(visibleStandingHeat.end),
						getYearProgress(visibleStandingHeat.start) + 2,
					)
				: undefined,
			dateRange,
			standingHeatDateRange,
		};
	}).filter(
		(segment): segment is NonNullable<typeof segment> => segment !== null,
	);
}

// Clamps a date range to the part that is visible inside one calendar year.
function getVisibleDateRange(startDate: Date, endDate: Date, year: number) {
	const yearStart = new Date(year, 0, 1);
	const yearEnd = new Date(year, 11, 31);
	const visibleStart = startDate > yearStart ? startDate : yearStart;
	const visibleEnd = endDate < yearEnd ? endDate : yearEnd;

	if (visibleEnd < yearStart || visibleStart > yearEnd) {
		return undefined;
	}

	return {
		start: visibleStart,
		end: visibleEnd,
	};
}

// Calculates how far into a year a date is, as a percentage from 0 to 100.
function getYearProgress(date: Date) {
	const yearStart = new Date(date.getFullYear(), 0, 1);
	const nextYearStart = new Date(date.getFullYear() + 1, 0, 1);
	const elapsed = date.getTime() - yearStart.getTime();
	const yearLength = nextYearStart.getTime() - yearStart.getTime();

	return Math.min(100, Math.max(0, (elapsed / yearLength) * 100));
}

// Formats one stored YYYY-MM-DD date as a short label, for example "Apr 12".

// Formats the original heat cycle dates as a compact range label.
function formatDateRange(
	startDate: string | undefined,
	endDate: string | undefined,
) {
	if (!startDate || !endDate) {
		return;
	}
	const start = formatCycleDate(startDate);
	const end = formatCycleDate(endDate);

	if (!start) {
		return undefined;
	}

	return end ? `${start} - ${end}` : start;
}

const Timelines = styled.div({
	display: 'grid',
	gap: spacings.x6,
	paddingTop: spacings.x4,
});

const YearRow = styled.div({
	display: 'grid',
	gap: spacings.x4,
	border: '1px solid rgba(252, 250, 247, 0.12)',
	backgroundColor: colors.pageBg,
	borderRadius: '8px',
	padding: `${spacings.x6} ${spacings.x5}`,
});

const YearLabel = styled.span({
	color: colors.warmWhite,
	fontSize: '16px',
	fontWeight: 800,
	letterSpacing: '0.08em',
});

const CycleSummaries = styled.div({
	display: 'flex',
	flexWrap: 'wrap',
	gap: spacings.x2,
	color: colors.warmGrey,
	fontSize: '0.75rem',
	fontWeight: 700,
});

const CycleSummary = styled.span({
	display: 'inline-flex',
	flexWrap: 'wrap',
	gap: spacings.x1,
	fontWeight: 200,
});

const Track = styled.div({
	position: 'relative',
	height: '24px',
	overflow: 'visible',
	borderRadius: '8px',
	backgroundColor: 'rgba(176, 162, 156, 0.28)',
	backgroundImage:
		'linear-gradient(to right, transparent calc(100% / 12 - 1px), rgba(176, 162, 156, 0.18) calc(100% / 12 - 1px), rgba(176, 162, 156, 0.18) calc(100% / 12), transparent calc(100% / 12))',
	backgroundSize: 'calc(100% / 12) 100%',
});

const HeatRange = styled.div({
	position: 'absolute',
	top: 0,
	bottom: 0,
	minWidth: '10px',
	borderRadius: '8px',
	backgroundColor: colors.brandMint,
});

const StandingHeatRange = styled.div({
	position: 'absolute',
	top: 0,
	bottom: 0,
	minWidth: '8px',
	height: '24px',
	borderRadius: '4px',
	backgroundColor: colors.orange,
});

const MonthLabels = styled.div({
	display: 'grid',
	gridTemplateColumns: 'repeat(12, 1fr)',
	color: colors.warmGrey,
	fontSize: '1rem',
	fontWeight: 800,
	letterSpacing: '0.12em',
	textAlign: 'center',
});

const Legend = styled.div({
	display: 'flex',
	gap: spacings.x6,
	color: colors.warmGrey,
	fontSize: '0.8rem',
	fontWeight: 700,
	letterSpacing: '0.08em',
	textTransform: 'uppercase',
	'& span': {
		display: 'inline-flex',
		alignItems: 'center',
	},
});

const LegendRange = styled.span({
	display: 'inline-block',
	width: '32px',
	height: '16px',
	marginRight: spacings.x3,
	borderRadius: '4px',
	backgroundColor: colors.brandMint,
});

const LegendMarker = styled.span({
	display: 'inline-block',
	width: '7px',
	height: '24px',
	marginRight: spacings.x3,
	borderRadius: '8px',
	backgroundColor: colors.orange,
});

const CycleIndicator = styled.div({
	display: 'flex',
	alignItems: 'center',
	gap: spacings.x2,
});

const IndicatorDot = styled.div({
	height: '10px',
	width: '10px',
	borderRadius: '8px',
});

const HeatDot = styled(IndicatorDot)({
	backgroundColor: colors.brandMint,
});

const StandingDot = styled(IndicatorDot)({
	backgroundColor: colors.orange,
});
