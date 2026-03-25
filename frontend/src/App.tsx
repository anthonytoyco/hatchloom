import { LaunchPadHome } from "@/pages/LaunchPadHome"
import { SandboxDetail } from "@/pages/SandboxDetail"
import { SideHustleDetail } from "@/pages/SideHustleDetail"
import { StudentHome } from "@/pages/StudentHome"
import { ToolPage } from "@/pages/ToolPage"
import { BrowserRouter, Route, Routes } from "react-router"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentHome />} />
        <Route path="/launchpad" element={<LaunchPadHome />} />
        <Route
          path="/launchpad/sandboxes/:sandboxId"
          element={<SandboxDetail />}
        />
        <Route
          path="/launchpad/sidehustles/:sideHustleId"
          element={<SideHustleDetail />}
        />
        <Route
          path="/launchpad/sandboxes/:sandboxId/tools/:toolType"
          element={<ToolPage />}
        />
        {/* Additional routes added as pages are built */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
