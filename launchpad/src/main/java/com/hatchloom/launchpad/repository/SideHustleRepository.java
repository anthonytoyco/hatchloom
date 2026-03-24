package com.hatchloom.launchpad.repository;

import com.hatchloom.launchpad.model.SideHustle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for {@link SideHustle} entities.
 */
public interface SideHustleRepository extends JpaRepository<SideHustle, UUID> {

    /**
     * Returns all SideHustles owned by the given student.
     *
     * @param studentId the student's UUID (from the Auth service)
     * @return list of SideHustles, empty if none found
     */
    List<SideHustle> findAllByStudentId(UUID studentId);
}
