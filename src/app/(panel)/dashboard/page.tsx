'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { useI18n } from '@/i18n/I18nProvider';
import { api, getApiError } from '@/lib/api';
import type { DashboardStats } from '@/lib/types';
import { formatNumber, formatRelative } from '@/lib/formatters';
import toast from 'react-hot-toast';

type Tone = 'brand' | 'success' | 'warn' | 'error' | 'info' | 'pink';

const TONE_COLORS: Record<Tone, { stroke: string; fill: string; chip: string; ring: string }> = {
  brand: {
    stroke: '#7B3FF2',
    fill: 'rgba(123,63,242,0.35)',
    chip: 'bg-brand-purple/15 text-brand-purple',
    ring: 'shadow-[inset_0_0_0_1px_rgba(123,63,242,0.22)]',
  },
  info: {
    stroke: '#00D1FF',
    fill: 'rgba(0,209,255,0.30)',
    chip: 'bg-brand-blue/15 text-brand-blue',
    ring: 'shadow-[inset_0_0_0_1px_rgba(0,209,255,0.22)]',
  },
  success: {
    stroke: '#00C853',
    fill: 'rgba(0,200,83,0.28)',
    chip: 'bg-status-success/15 text-status-success',
    ring: 'shadow-[inset_0_0_0_1px_rgba(0,200,83,0.22)]',
  },
  warn: {
    stroke: '#FFB020',
    fill: 'rgba(255,176,32,0.28)',
    chip: 'bg-status-warn/15 text-status-warn',
    ring: 'shadow-[inset_0_0_0_1px_rgba(255,176,32,0.22)]',
  },
  error: {
    stroke: '#FF5252',
    fill: 'rgba(255,82,82,0.28)',
    chip: 'bg-status-error/15 text-status-error',
    ring: 'shadow-[inset_0_0_0_1px_rgba(255,82,82,0.22)]',
  },
  pink: {
    stroke: '#FF4DA6',
    fill: 'rgba(255,77,166,0.30)',
    chip: 'bg-brand-pink/15 text-brand-pink',
    ring: 'shadow-[inset_0_0_0_1px_rgba(255,77,166,0.22)]',
  },
};

export default function DashboardPage() {
  const { t, locale } = useI18n();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get<DashboardStats>('/admin/stats')
      .then((r) => {
        if (!cancelled) setData(r.data);
      })
      .catch((err) => toast.error(getApiError(err).message))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col gap-[1.2vh] lg:overflow-hidden max-lg:gap-[2vh]">
      <PageHeader
        compact
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
        className="shrink-0 lg:h-[8%]"
      />

      <section className="grid min-h-0 shrink-0 grid-cols-2 grid-rows-4 gap-[1vh] sm:grid-cols-4 sm:grid-rows-2 lg:h-[30%]">
        <StatTile
          label={t('dashboard.totalUsers')}
          description={t('dashboard.totalUsersDesc')}
          value={data?.counts.users}
          loading={loading}
          tone="brand"
          icon={<Icon.Users className="h-[55%] w-[55%]" />}
        />
        <StatTile
          label={t('dashboard.newUsers24h')}
          description={t('dashboard.newUsers24hDesc')}
          value={data?.counts.newUsers24h}
          loading={loading}
          tone="info"
          icon={<NewUserIcon className="h-[55%] w-[55%]" />}
        />
        <StatTile
          label={t('dashboard.newUsers7d')}
          description={t('dashboard.newUsers7dDesc')}
          value={data?.counts.newUsers7d}
          loading={loading}
          tone="info"
          icon={<CalendarIcon className="h-[55%] w-[55%]" />}
        />
        <StatTile
          label={t('dashboard.admins')}
          description={t('dashboard.adminsDesc')}
          value={data?.counts.admins}
          loading={loading}
          tone="pink"
          icon={<Icon.Shield className="h-[55%] w-[55%]" />}
        />
        <StatTile
          label={t('dashboard.bannedUsers')}
          description={t('dashboard.bannedUsersDesc')}
          value={data?.counts.bannedUsers}
          loading={loading}
          tone="error"
          icon={<Icon.Ban className="h-[55%] w-[55%]" />}
        />
        <StatTile
          label={t('dashboard.openReports')}
          description={t('dashboard.openReportsDesc')}
          value={data?.counts.openReports}
          loading={loading}
          tone="warn"
          icon={<AlertIcon className="h-[55%] w-[55%]" />}
        />
        <StatTile
          label={t('dashboard.activeGames')}
          description={t('dashboard.activeGamesDesc')}
          value={data ? `${data.counts.activeGames}/${data.counts.games}` : undefined}
          loading={loading}
          tone="success"
          icon={<Icon.Games className="h-[55%] w-[55%]" />}
        />
        <StatTile
          label={t('dashboard.activeMatches')}
          description={t('dashboard.activeMatchesDesc')}
          value={data?.counts.activeMatches}
          loading={loading}
          tone="success"
          icon={<Icon.Matches className="h-[55%] w-[55%]" />}
        />
      </section>

      <section className="grid min-h-0 flex-1 grid-cols-1 gap-[1vh] lg:grid-cols-3">
        <Card className="flex min-h-0 flex-col lg:col-span-2">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-[1%] border-b border-glass-border px-[3%] py-[2%]">
            <div>
              <h2 className="text-[clamp(0.75rem,1.2vw,0.9rem)] font-semibold text-ink">
                {t('dashboard.chartTitle')}
              </h2>
              <p className="text-[clamp(0.6rem,0.95vw,0.7rem)] text-ink-secondary">
                {t('dashboard.chartStarted')} - {t('dashboard.chartEnded')}
              </p>
            </div>
            <div className="flex items-center gap-[2%] text-[clamp(0.55rem,0.85vw,0.7rem)] text-ink-secondary">
              <span className="flex items-center gap-[0.4em]">
                <span className="aspect-square w-[0.55em] rounded-full bg-brand-purple shadow-[0_0_6px_rgba(123,63,242,0.8)]" />
                {t('dashboard.chartStarted')}
              </span>
              <span className="flex items-center gap-[0.4em]">
                <span className="aspect-square w-[0.55em] rounded-full bg-brand-blue shadow-[0_0_6px_rgba(0,209,255,0.8)]" />
                {t('dashboard.chartEnded')}
              </span>
            </div>
          </div>
          <div className="min-h-0 flex-1 p-[2%]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : data ? (
              <MatchesLineChart data={data.matchesChart} />
            ) : (
              <EmptyState title={t('common.empty')} />
            )}
          </div>
        </Card>

        <Card className="flex min-h-0 flex-col">
          <div className="shrink-0 border-b border-glass-border px-[3%] py-[2%]">
            <h2 className="text-[clamp(0.75rem,1.2vw,0.9rem)] font-semibold text-ink">
              {t('dashboard.recentRegistrations')}
            </h2>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden p-[1.5%]">
            {loading ? (
              <div className="flex h-full flex-col gap-[1%] p-[1%]">
                <Skeleton className="h-[18%] w-full" />
                <Skeleton className="h-[18%] w-full" />
                <Skeleton className="h-[18%] w-full" />
              </div>
            ) : data && data.recentRegistrations.length > 0 ? (
              <ul className="flex h-full flex-col justify-between">
                {data.recentRegistrations.slice(0, 5).map((u) => (
                  <li key={u.id} className="min-h-0 flex-1">
                    <Link
                      href={`/users/${u.id}`}
                      className="group flex h-full items-center gap-[3%] rounded-xl2 px-[2%] py-[1%] transition-colors hover:bg-glass-highlight"
                    >
                      <Avatar
                        src={u.photoUrl}
                        name={u.name}
                        size={28}
                        className="!h-[clamp(1.4rem,2.2vw,1.75rem)] !w-[clamp(1.4rem,2.2vw,1.75rem)] !text-[clamp(0.55rem,0.9vw,0.7rem)]"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[clamp(0.7rem,1.05vw,0.8rem)] font-semibold text-ink">
                          {u.name}
                        </p>
                        <p className="truncate text-[clamp(0.55rem,0.85vw,0.68rem)] text-ink-secondary">
                          {u.email}
                        </p>
                      </div>
                      <span className="whitespace-nowrap text-[clamp(0.55rem,0.8vw,0.65rem)] text-ink-disabled">
                        {formatRelative(u.createdAt, locale)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title={t('dashboard.noRecentUsers')} />
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}

interface StatTileProps {
  label: string;
  description: string;
  value: number | string | undefined;
  loading: boolean;
  tone: Tone;
  icon: React.ReactNode;
}

function StatTile({ label, description, value, loading, tone, icon }: StatTileProps) {
  const { locale } = useI18n();
  const colors = TONE_COLORS[tone];

  return (
    <Card
      className={'relative flex h-full min-h-0 flex-col justify-between p-[6%] ' + colors.ring}
      hoverable
    >
      <div className="flex items-start justify-between gap-[3%]">
        <span
          className={
            'flex aspect-square w-[22%] min-w-0 max-w-[2rem] items-center justify-center rounded-xl2 ' +
            colors.chip
          }
        >
          {icon}
        </span>
        <p className="pt-[2%] text-right text-[clamp(0.5rem,0.75vw,0.62rem)] font-semibold uppercase leading-tight tracking-[0.12em] text-ink-secondary">
          {label}
        </p>
      </div>
      <div className="text-[clamp(1rem,2vw,1.6rem)] font-bold leading-none text-ink">
        {loading ? (
          <Skeleton className="h-[1em] w-[40%]" />
        ) : value === undefined ? (
          '—'
        ) : typeof value === 'number' ? (
          formatNumber(value, locale)
        ) : (
          value
        )}
      </div>
      <div className="flex min-h-0 items-end justify-between gap-[3%]">
        <p className="text-[clamp(0.5rem,0.8vw,0.65rem)] leading-tight text-ink-secondary">
          {description}
        </p>
        <Sparkline seed={label} stroke={colors.stroke} fill={colors.fill} />
      </div>
    </Card>
  );
}

function Sparkline({
  seed,
  stroke,
  fill,
}: {
  seed: string;
  stroke: string;
  fill: string;
}) {
  const { points, areaPath, linePath } = useMemo(() => buildSparkline(seed), [seed]);
  const gradId = useMemo(() => `spark-${hash(seed)}`, [seed]);
  return (
    <svg
      viewBox="0 0 88 28"
      fill="none"
      className="h-[70%] w-[32%] shrink-0"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} />
          <stop offset="100%" stopColor={fill} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={linePath}
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {points.map((p, i) =>
        i === points.length - 1 ? (
          <circle key={i} cx={p.x} cy={p.y} r={1.8} fill={stroke} />
        ) : null,
      )}
    </svg>
  );
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function buildSparkline(seed: string) {
  const w = 88;
  const h = 28;
  const padY = 4;
  const count = 12;
  const base = hash(seed);
  const values: number[] = [];
  for (let i = 0; i < count; i++) {
    const v = (Math.sin((base + i * 13) * 0.37) + Math.sin((base + i * 7) * 0.19)) * 0.5;
    values.push((v + 1) / 2);
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values.map((v, i) => ({
    x: (i / (count - 1)) * (w - 4) + 2,
    y: h - padY - ((v - min) / range) * (h - padY * 2),
  }));
  const linePath = catmullRomPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${h} L ${points[0].x} ${h} Z`;
  return { points, linePath, areaPath };
}

function catmullRomPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  const d: string[] = [`M ${points[0].x} ${points[0].y}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d.push(`C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`);
  }
  return d.join(' ');
}

function MatchesLineChart({
  data,
}: {
  data: Array<{ day: string; matches: number; ended: number }>;
}) {
  const { locale } = useI18n();
  const w = 720;
  const h = 240;
  const padL = 32;
  const padR = 16;
  const padT = 12;
  const padB = 28;

  const max = useMemo(() => {
    const raw = Math.max(1, ...data.flatMap((d) => [d.matches, d.ended]));
    const step = niceStep(raw / 4);
    return Math.ceil(raw / step) * step;
  }, [data]);
  const step = useMemo(() => niceStep(max / 4), [max]);
  const ticks = useMemo(() => {
    const out: number[] = [];
    for (let v = 0; v <= max; v += step) out.push(v);
    return out;
  }, [max, step]);

  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const xOf = (i: number) =>
    padL + (data.length <= 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const yOf = (v: number) => padT + innerH - (v / max) * innerH;

  const startedPoints = data.map((d, i) => ({ x: xOf(i), y: yOf(d.matches) }));
  const endedPoints = data.map((d, i) => ({ x: xOf(i), y: yOf(d.ended) }));

  const startedLine = catmullRomPath(startedPoints);
  const endedLine = catmullRomPath(endedPoints);
  const startedArea =
    startedPoints.length > 0
      ? `${startedLine} L ${startedPoints[startedPoints.length - 1].x} ${padT + innerH} L ${startedPoints[0].x} ${padT + innerH} Z`
      : '';
  const endedArea =
    endedPoints.length > 0
      ? `${endedLine} L ${endedPoints[endedPoints.length - 1].x} ${padT + innerH} L ${endedPoints[0].x} ${padT + innerH} Z`
      : '';

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-full w-full"
      preserveAspectRatio="none"
      role="img"
    >
      <defs>
        <linearGradient id="started-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7B3FF2" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#7B3FF2" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="ended-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00D1FF" stopOpacity={0.30} />
          <stop offset="100%" stopColor="#00D1FF" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="started-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF4DA6" />
          <stop offset="100%" stopColor="#7B3FF2" />
        </linearGradient>
        <linearGradient id="ended-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00D1FF" />
          <stop offset="100%" stopColor="#7B3FF2" />
        </linearGradient>
      </defs>

      {ticks.map((v) => {
        const y = yOf(v);
        return (
          <g key={v}>
            <line
              x1={padL}
              x2={w - padR}
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="3 4"
            />
            <text
              x={padL - 8}
              y={y + 3}
              textAnchor="end"
              fontSize="10"
              fill="rgba(184,184,204,0.7)"
            >
              {v}
            </text>
          </g>
        );
      })}

      <path d={endedArea} fill="url(#ended-fill)" />
      <path d={startedArea} fill="url(#started-fill)" />
      <path
        d={endedLine}
        stroke="url(#ended-stroke)"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={startedLine}
        stroke="url(#started-stroke)"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {endedPoints.map((p, i) => (
        <g key={`e-${i}`}>
          <circle cx={p.x} cy={p.y} r={4.5} fill="#0A0A12" />
          <circle cx={p.x} cy={p.y} r={3.5} fill="#00D1FF" />
        </g>
      ))}
      {startedPoints.map((p, i) => (
        <g key={`s-${i}`}>
          <circle cx={p.x} cy={p.y} r={4.5} fill="#0A0A12" />
          <circle cx={p.x} cy={p.y} r={3.5} fill="#7B3FF2" />
        </g>
      ))}

      {data.map((d, i) => {
        const date = new Date(d.day);
        const label = date
          .toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US', { weekday: 'short' })
          .toUpperCase()
          .replace('.', '');
        return (
          <text
            key={d.day}
            x={xOf(i)}
            y={h - 8}
            textAnchor="middle"
            fontSize="10"
            fill="rgba(184,184,204,0.8)"
            fontWeight={600}
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

function niceStep(raw: number): number {
  if (raw <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / pow;
  let step: number;
  if (norm <= 1) step = 1;
  else if (norm <= 2) step = 2;
  else if (norm <= 5) step = 5;
  else step = 10;
  return Math.max(1, step * pow);
}

function NewUserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="8" r="4" />
      <path d="M2 20c.5-3.5 3.5-6 7-6s6.5 2.5 7 6" />
      <path d="M19 8v6M16 11h6" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M3 9h18M8 4v5M16 4v5" />
      <path d="M8 14h3M8 17h6" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l10 17H2L12 3z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" />
    </svg>
  );
}
