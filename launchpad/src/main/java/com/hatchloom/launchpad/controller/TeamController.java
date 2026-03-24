package com.hatchloom.launchpad.controller;

import com.hatchloom.launchpad.dto.request.AddTeamMemberRequest;
import com.hatchloom.launchpad.dto.response.TeamMemberResponse;
import com.hatchloom.launchpad.service.TeamService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controller for SideHustle team membership operations.
 *
 * <p>Adding a member validates that the caller owns the SideHustle via the JWT subject.</p>
 */
@RestController
@RequestMapping("/launchpad/sidehustles/{sideHustleId}/team/members")
@Tag(name = "Team")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping
    public ResponseEntity<TeamMemberResponse> addMember(@PathVariable UUID sideHustleId,
                                                         @Valid @RequestBody AddTeamMemberRequest request,
                                                         @AuthenticationPrincipal Jwt jwt) {
        UUID callerId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(teamService.addMember(sideHustleId, request.getUserId(),
                        request.getRole(), callerId));
    }

    @GetMapping
    public ResponseEntity<List<TeamMemberResponse>> listMembers(@PathVariable UUID sideHustleId) {
        return ResponseEntity.ok(teamService.listMembers(sideHustleId));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> removeMember(@PathVariable UUID sideHustleId,
                                              @PathVariable UUID userId) {
        teamService.removeMember(sideHustleId, userId);
        return ResponseEntity.noContent().build();
    }
}
