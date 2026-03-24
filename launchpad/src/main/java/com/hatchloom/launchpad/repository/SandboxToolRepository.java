package com.hatchloom.launchpad.repository;

import com.hatchloom.launchpad.model.SandboxTool;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for {@link SandboxTool} entities.
 */
public interface SandboxToolRepository extends JpaRepository<SandboxTool, UUID> {

    /**
     * Returns all tools belonging to a given sandbox.
     *
     * @param sandboxId the sandbox's UUID
     * @return list of tools, empty if none found
     */
    List<SandboxTool> findAllBySandbox_Id(UUID sandboxId);
}
