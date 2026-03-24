package com.hatchloom.launchpad.controller;

import com.hatchloom.launchpad.dto.request.CreatePositionRequest;
import com.hatchloom.launchpad.dto.request.UpdatePositionStatusRequest;
import com.hatchloom.launchpad.dto.response.PositionResponse;
import com.hatchloom.launchpad.service.PositionService;
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
 * Controller for Position lifecycle operations.
 *
 * <p>Also exposes the public Position Status Interface consumed by ConnectHub:
 * {@code GET /launchpad/positions/{positionId}/status}.</p>
 */
@RestController
@Tag(name = "Position")
public class PositionController {

    private final PositionService positionService;

    public PositionController(PositionService positionService) {
        this.positionService = positionService;
    }

    @PostMapping("/launchpad/sidehustles/{sideHustleId}/positions")
    public ResponseEntity<PositionResponse> createPosition(@PathVariable UUID sideHustleId,
                                                            @Valid @RequestBody CreatePositionRequest request,
                                                            @AuthenticationPrincipal Jwt jwt) {
        UUID callerId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(positionService.createPosition(sideHustleId, request, callerId));
    }

    @GetMapping("/launchpad/sidehustles/{sideHustleId}/positions")
    public ResponseEntity<List<PositionResponse>> listPositions(@PathVariable UUID sideHustleId) {
        return ResponseEntity.ok(positionService.listPositions(sideHustleId));
    }

    @PutMapping("/launchpad/sidehustles/{sideHustleId}/positions/{positionId}/status")
    public ResponseEntity<PositionResponse> updatePositionStatus(@PathVariable UUID sideHustleId,
                                                                   @PathVariable UUID positionId,
                                                                   @Valid @RequestBody UpdatePositionStatusRequest request) {
        return ResponseEntity.ok(positionService.updatePositionStatus(positionId, request.getStatus()));
    }

    /**
     * Position Status Interface — public endpoint consumed by ConnectHub.
     * Returns the plain-text status string for a position.
     *
     * @param positionId the position UUID
     * @return status string: "OPEN", "FILLED", or "CLOSED"
     */
    @GetMapping("/launchpad/positions/{positionId}/status")
    public ResponseEntity<String> getPositionStatus(@PathVariable UUID positionId) {
        return ResponseEntity.ok(positionService.getPositionStatus(positionId));
    }
}
