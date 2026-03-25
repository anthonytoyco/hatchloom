import { LAUNCHPAD_SIDEBAR_SECTIONS } from "@/components/launchpad/navigation"
import {
  CHANNELS,
  RECOMMENDED,
  TAGGED_RESOURCES,
  TEAM_MEMBERS,
} from "@/components/launchpad/sidehustle-detail/demo-data"
import {
  AddTeamMemberDialog,
  BMCSection,
  EditSideHustleDialog,
  PositionsSection,
} from "@/components/launchpad/sidehustle-detail/management-sections"
import {
  BusinessCard,
  ChannelCard,
  CommsCard,
  HeroCard,
  ResourceCard,
  ShelfRow,
  TodoCard,
} from "@/components/launchpad/sidehustle-detail/panel-cards"
import { AppLayout } from "@/components/layout/AppLayout"
import { useDeleteSideHustle, useRemoveTeamMember } from "@/hooks/use-mutations"
import { useSideHustle } from "@/hooks/use-side-hustle"
import { ArrowRight, ChevronRight } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router"

// ── Page ──────────────────────────────────────────────────────────────────────

export function SideHustleDetail() {
  const { sideHustleId = "22222222-2222-2222-2222-222222222201" } = useParams<{
    sideHustleId: string
  }>()
  const navigate = useNavigate()
  const { sideHustle, bmc, team, positions, isLoading } =
    useSideHustle(sideHustleId)
  const deleteSideHustle = useDeleteSideHustle()
  const removeTeamMember = useRemoveTeamMember(sideHustleId)

  const [showEdit, setShowEdit] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)

  async function handleDelete() {
    await deleteSideHustle.mutateAsync(sideHustleId)
    void navigate("/launchpad")
  }

  return (
    <AppLayout
      sidebarSections={LAUNCHPAD_SIDEBAR_SECTIONS}
      sidebarCta={{ label: "💬 Contact Hatchloom", href: "#" }}
    >
      <div className="px-7 pt-5 pb-10">
        {/* Breadcrumb */}
        <nav className="mb-2.5 flex items-center gap-1.5 text-[0.72rem] font-semibold text-muted-foreground">
          <Link to="/" className="text-hatch-pink hover:underline">
            Student Home
          </Link>
          <ChevronRight className="size-3 text-border" />
          <Link to="/launchpad" className="text-hatch-pink hover:underline">
            Launchpad
          </Link>
          <ChevronRight className="size-3 text-border" />
          <Link
            to="/launchpad/sidehustles"
            className="text-hatch-pink hover:underline"
          >
            My SideHustles
          </Link>
          <ChevronRight className="size-3 text-border" />
          <span>🧈 {sideHustle?.title ?? "…"}</span>
        </nav>

        {/* Hero */}
        {isLoading ? (
          <div className="mb-4 h-[90px] animate-pulse rounded-2xl bg-muted" />
        ) : sideHustle ? (
          <HeroCard
            title={sideHustle.title}
            description={sideHustle.description}
            status={sideHustle.status}
            team={team}
            fallbackTeam={TEAM_MEMBERS}
            onEdit={() => setShowEdit(true)}
            onDelete={() => void handleDelete()}
            onAddMember={() => setShowAddMember(true)}
            onRemoveMember={(memberId) =>
              void removeTeamMember.mutateAsync(memberId)
            }
          />
        ) : (
          <div className="mb-4 rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            SideHustle not found.
          </div>
        )}

        {/* Business cards */}
        <BusinessCard type="running" />
        <BusinessCard type="growing" />

        {/* BMC */}
        {bmc && <BMCSection bmc={bmc} sideHustleId={sideHustleId} />}

        {/* Positions */}
        <PositionsSection positions={positions} sideHustleId={sideHustleId} />

        {/* Todos + Comms */}
        <div className="mb-5 grid grid-cols-2 gap-4">
          <TodoCard />
          <CommsCard />
        </div>

        {/* Nudge */}
        <div className="mb-5 flex animate-[fadeUp_0.35s_ease_0.2s_both] cursor-pointer items-center gap-2.5 rounded-[9px] border-[1.5px] border-amber-200 bg-amber-50 px-3 py-2.5 transition-all hover:border-amber-400 hover:shadow-[0_2px_6px_rgba(217,119,6,0.12)]">
          <span className="text-base">👋</span>
          <div>
            <p className="font-heading text-[0.7rem] font-bold text-hatch-charcoal">
              Need help at your next market?
            </p>
            <p className="text-[0.58rem] text-muted-foreground">
              Post to Classifieds and find a teammate
            </p>
          </div>
          <ArrowRight className="ml-auto size-4 text-amber-500" />
        </div>

        {/* Shelves */}
        <ShelfRow title="📌 Tagged Resources" action="See all →">
          {TAGGED_RESOURCES.map((r) => (
            <ResourceCard key={r.name} r={r} />
          ))}
        </ShelfRow>
        <ShelfRow title="📡 Active Channels" action="Manage →">
          {CHANNELS.map((c) => (
            <ChannelCard key={c.name} c={c} />
          ))}
        </ShelfRow>
        <ShelfRow title="✨ Recommended">
          {RECOMMENDED.map((r) => (
            <ResourceCard key={r.name} r={r} />
          ))}
        </ShelfRow>
      </div>

      {/* Dialogs */}
      {sideHustle && (
        <EditSideHustleDialog
          open={showEdit}
          sideHustleId={sideHustleId}
          initialTitle={sideHustle.title}
          initialDescription={sideHustle.description}
          onClose={() => setShowEdit(false)}
        />
      )}
      <AddTeamMemberDialog
        open={showAddMember}
        sideHustleId={sideHustleId}
        onClose={() => setShowAddMember(false)}
      />
    </AppLayout>
  )
}
