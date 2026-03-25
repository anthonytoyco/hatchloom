import { LAUNCHPAD_SIDEBAR_SECTIONS } from "@/components/launchpad/navigation"
import {
  CHANNELS,
  RECOMMENDED,
  TAGGED_RESOURCES,
} from "@/components/launchpad/sandbox-detail/demo-data"
import {
  ActiveToolsCard,
  AddToolDialog,
  EditSandboxDialog,
  HeroCard,
} from "@/components/launchpad/sandbox-detail/main-sections"
import {
  ChannelCard,
  CommsCard,
  ResourceCard,
  ShelfRow,
  TodoCard,
} from "@/components/launchpad/sandbox-detail/panel-cards"
import { AppLayout } from "@/components/layout/AppLayout"
import { useDeleteSandbox } from "@/hooks/use-mutations"
import { useSandbox } from "@/hooks/use-sandbox"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router"

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-[14px] bg-muted", className)} />
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function SandboxDetail() {
  const { sandboxId = "11111111-1111-1111-1111-111111111101" } = useParams<{
    sandboxId: string
  }>()
  const navigate = useNavigate()
  const { sandbox, tools, isLoading } = useSandbox(sandboxId)
  const deleteSandbox = useDeleteSandbox()

  const [showAddTool, setShowAddTool] = useState(false)
  const [showEditSandbox, setShowEditSandbox] = useState(false)

  async function handleDelete() {
    await deleteSandbox.mutateAsync(sandboxId)
    void navigate("/launchpad")
  }

  return (
    <AppLayout
      sidebarSections={LAUNCHPAD_SIDEBAR_SECTIONS}
      sidebarCta={{ label: "💬 Contact Hatchloom", href: "#" }}
    >
      <div className="px-8 pt-6 pb-10">
        {/* Breadcrumb */}
        <nav className="mb-3 flex items-center gap-1.5 text-[0.72rem] font-semibold text-muted-foreground">
          <Link to="/" className="text-hatch-pink hover:underline">
            Student Home
          </Link>
          <ChevronRight className="size-3 text-border" />
          <Link to="/launchpad" className="text-hatch-pink hover:underline">
            Launchpad
          </Link>
          <ChevronRight className="size-3 text-border" />
          <Link to="/launchpad" className="text-hatch-pink hover:underline">
            My Sandboxes
          </Link>
          <ChevronRight className="size-3 text-border" />
          <span>♻️ {sandbox?.title ?? "…"}</span>
        </nav>

        {/* Zone 1 - Hero */}
        {isLoading ? (
          <SkeletonCard className="mb-4 h-[340px]" />
        ) : sandbox ? (
          <HeroCard
            title={sandbox.title}
            description={sandbox.description}
            onEdit={() => setShowEditSandbox(true)}
            onDelete={() => void handleDelete()}
          />
        ) : (
          <div className="mb-4 rounded-[18px] border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Sandbox not found.
          </div>
        )}

        {/* Quick Actions bar */}
        <div className="mb-6 flex animate-[fadeUp_0.4s_ease_0.08s_both] gap-2 rounded-xl border border-border bg-card px-4 py-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          {[
            "📝 Add Note",
            "✅ Add Todo",
            "📅 Set Milestone",
            "🔗 Add Resource",
            "📤 Share",
          ].map((label) => (
            <button
              key={label}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-hatch-bg px-3 py-[0.4rem] font-heading text-[0.75rem] font-bold text-muted-foreground transition-all hover:border-sandbox-green hover:bg-green-50 hover:text-sandbox-green"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Zone 2 - Working Wall */}

        {/* Active Tools */}
        {isLoading ? (
          <SkeletonCard className="mb-5 h-[130px]" />
        ) : (
          <div className="mb-5 animate-[fadeUp_0.4s_ease_0.12s_both]">
            <ActiveToolsCard
              tools={tools}
              sandboxId={sandboxId}
              onAddTool={() => setShowAddTool(true)}
            />
          </div>
        )}

        {/* Todos + Comms */}
        <div className="mb-8 grid animate-[fadeUp_0.4s_ease_0.16s_both] grid-cols-2 gap-5">
          {isLoading ? (
            <>
              <SkeletonCard className="h-[200px]" />
              <SkeletonCard className="h-[200px]" />
            </>
          ) : (
            <>
              <TodoCard />
              <CommsCard />
            </>
          )}
        </div>

        {/* Zone 3 - Shelf */}
        <div className="animate-[fadeUp_0.4s_ease_0.28s_both]">
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

          <ShelfRow title="✨ Recommended for This Project">
            {RECOMMENDED.map((r) => (
              <ResourceCard key={r.name} r={r} />
            ))}
          </ShelfRow>
        </div>
      </div>

      {/* Dialogs */}
      <AddToolDialog
        open={showAddTool}
        sandboxId={sandboxId}
        onClose={() => setShowAddTool(false)}
      />
      {sandbox && (
        <EditSandboxDialog
          open={showEditSandbox}
          sandboxId={sandboxId}
          initialTitle={sandbox.title}
          initialDescription={sandbox.description}
          onClose={() => setShowEditSandbox(false)}
        />
      )}
    </AppLayout>
  )
}
