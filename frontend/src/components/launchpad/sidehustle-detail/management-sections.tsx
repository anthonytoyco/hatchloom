import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  useAddTeamMember,
  useCreatePosition,
  usePatchBMC,
  useUpdatePositionStatus,
  useUpdateSideHustle,
} from "@/hooks/use-mutations"
import type { BusinessModelCanvas, Position, PositionStatus } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import { useState } from "react"

export function EditSideHustleDialog({
  open,
  sideHustleId,
  initialTitle,
  initialDescription,
  onClose,
}: {
  open: boolean
  sideHustleId: string
  initialTitle: string
  initialDescription: string | null
  onClose: () => void
}) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription ?? "")
  const { mutateAsync, isPending } = useUpdateSideHustle(sideHustleId)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    await mutateAsync({
      title: title.trim(),
      description: description.trim() || undefined,
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg font-black text-hatch-charcoal">
            Edit SideHustle ✏️
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label
              htmlFor="sh-edit-title"
              className="font-heading text-xs font-bold"
            >
              Title <span className="text-hatch-pink">*</span>
            </Label>
            <Input
              id="sh-edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="sh-edit-desc"
              className="font-heading text-xs font-bold"
            >
              Description
            </Label>
            <Textarea
              id="sh-edit-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || isPending}
              className="bg-hatch-pink text-white hover:bg-hatch-pink/90"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function AddTeamMemberDialog({
  open,
  sideHustleId,
  onClose,
}: {
  open: boolean
  sideHustleId: string
  onClose: () => void
}) {
  const [userId, setUserId] = useState("")
  const [role, setRole] = useState("")
  const { mutateAsync, isPending } = useAddTeamMember(sideHustleId)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId.trim()) return
    await mutateAsync({ userId: userId.trim(), role: role.trim() || undefined })
    onClose()
    setUserId("")
    setRole("")
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg font-black text-hatch-charcoal">
            Add Team Member 👥
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label
              htmlFor="tm-userid"
              className="font-heading text-xs font-bold"
            >
              User ID <span className="text-hatch-pink">*</span>
            </Label>
            <Input
              id="tm-userid"
              placeholder="Student UUID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tm-role" className="font-heading text-xs font-bold">
              Role
            </Label>
            <Input
              id="tm-role"
              placeholder="e.g. Co-Founder"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!userId.trim() || isPending}
              className="bg-hatch-pink text-white hover:bg-hatch-pink/90"
            >
              Add Member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const BMC_SECTIONS: {
  key: keyof Omit<BusinessModelCanvas, "id" | "sideHustleId">
  label: string
  section: string
}[] = [
  { key: "keyPartners", label: "Key Partners", section: "key_partners" },
  { key: "keyActivities", label: "Key Activities", section: "key_activities" },
  { key: "keyResources", label: "Key Resources", section: "key_resources" },
  {
    key: "valuePropositions",
    label: "Value Propositions",
    section: "value_propositions",
  },
  {
    key: "customerRelationships",
    label: "Customer Relationships",
    section: "customer_relationships",
  },
  { key: "channels", label: "Channels", section: "channels" },
  {
    key: "customerSegments",
    label: "Customer Segments",
    section: "customer_segments",
  },
  { key: "costStructure", label: "Cost Structure", section: "cost_structure" },
  {
    key: "revenueStreams",
    label: "Revenue Streams",
    section: "revenue_streams",
  },
]

export function BMCSection({
  bmc,
  sideHustleId,
}: {
  bmc: BusinessModelCanvas
  sideHustleId: string
}) {
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState("")
  const { mutateAsync, isPending } = usePatchBMC(sideHustleId)

  async function handleSave(sectionKey: string) {
    await mutateAsync({
      section: sectionKey,
      content: draft,
    })
    setEditing(null)
  }

  return (
    <div className="mb-5 rounded-xl border border-border bg-card p-4 shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-heading text-[0.85rem] font-extrabold text-hatch-charcoal">
          📋 Business Model Canvas
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {BMC_SECTIONS.map(({ key, label, section }) => {
          const isEditing = editing === section
          const value = bmc[key]
          return (
            <div
              key={key}
              className="rounded-lg border border-border bg-hatch-bg p-2.5"
            >
              <p className="mb-1 font-heading text-[0.6rem] font-extrabold tracking-[0.04em] text-muted-foreground/60 uppercase">
                {label}
              </p>
              {isEditing ? (
                <>
                  <textarea
                    className="mb-1.5 h-16 w-full resize-none rounded border border-sandbox-green bg-white px-2 py-1 text-[0.72rem] text-foreground outline-none"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => void handleSave(section)}
                      disabled={isPending}
                      className="flex-1 rounded bg-sandbox-green py-0.5 font-heading text-[0.6rem] font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="flex-1 rounded border border-border py-0.5 font-heading text-[0.6rem] font-bold text-muted-foreground hover:bg-muted"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => {
                    setEditing(section)
                    setDraft(value ?? "")
                  }}
                  className="w-full text-left"
                >
                  <p className="min-h-[2.5rem] text-[0.7rem] leading-snug text-foreground/80">
                    {value ?? (
                      <span className="text-muted-foreground/50 italic">
                        Click to edit...
                      </span>
                    )}
                  </p>
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function PositionsSection({
  positions,
  sideHustleId,
}: {
  positions: Position[]
  sideHustleId: string
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const createPosition = useCreatePosition(sideHustleId)
  const updateStatus = useUpdatePositionStatus()

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    await createPosition.mutateAsync({
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
    })
    setShowAdd(false)
    setNewTitle("")
    setNewDesc("")
  }

  const STATUS_CYCLE: Record<PositionStatus, PositionStatus> = {
    OPEN: "FILLED",
    FILLED: "CLOSED",
    CLOSED: "OPEN",
  }

  const STATUS_STYLE: Record<PositionStatus, string> = {
    OPEN: "border-green-200 bg-green-50 text-sandbox-green",
    FILLED: "border-amber-200 bg-amber-50 text-amber-600",
    CLOSED: "border-border bg-muted text-muted-foreground",
  }

  return (
    <div className="mb-5 rounded-xl border border-border bg-card p-4 shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-heading text-[0.85rem] font-extrabold text-hatch-charcoal">
          💼 Open Positions
        </span>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-1 font-heading text-[0.7rem] font-bold text-hatch-pink hover:opacity-80"
        >
          <Plus className="size-3" /> Add Position
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={(e) => void handleCreate(e)}
          className="mb-3 space-y-2 rounded-lg border border-dashed border-border bg-hatch-bg p-3"
        >
          <Input
            placeholder="Position title *"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Description (optional)"
            rows={2}
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={!newTitle.trim() || createPosition.isPending}
              size="sm"
              className="bg-hatch-pink text-white hover:bg-hatch-pink/90"
            >
              Create
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAdd(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {positions.length === 0 && !showAdd ? (
        <p className="py-3 text-center text-[0.75rem] text-muted-foreground/60">
          No positions yet.
        </p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {positions.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2 rounded-lg border border-border bg-hatch-bg px-3 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="font-heading text-[0.78rem] font-bold text-hatch-charcoal">
                  {p.title}
                </p>
                {p.description && (
                  <p className="text-[0.67rem] text-muted-foreground">
                    {p.description}
                  </p>
                )}
              </div>
              <button
                onClick={() =>
                  void updateStatus.mutateAsync({
                    positionId: p.id,
                    status: STATUS_CYCLE[p.status],
                    sideHustleId,
                  })
                }
                className={cn(
                  "rounded-full border px-2 py-0.5 font-heading text-[0.6rem] font-bold transition-all hover:opacity-80",
                  STATUS_STYLE[p.status]
                )}
              >
                {p.status}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
