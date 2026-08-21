package com.myus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Response for the admin class-transfer screen: the source offering, its
 * enrolled students, and the candidate target sections the students may be
 * moved to (same course and term).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfferingRosterResponse {

    private CourseOfferingResponse offering;

    private List<RosterStudent> students = new ArrayList<>();

    private List<CourseOfferingResponse> targets = new ArrayList<>();
}
