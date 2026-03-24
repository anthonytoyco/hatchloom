package com.hatchloom.launchpad.repository;

import com.hatchloom.launchpad.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for {@link Team} entities.
 */
public interface TeamRepository extends JpaRepository<Team, UUID> {

    /**
     * Returns the Team for the given SideHustle, if it exists.
     *
     * @param sideHustleId the SideHustle's UUID
     * @return the Team wrapped in Optional, or empty if not found
     */
    Optional<Team> findBySideHustle_Id(UUID sideHustleId);
}
