package myus.service;

import myus.dto.GradeResponse;

import java.util.List;

public interface GradeService {

    List<GradeResponse> getMyGrades(String username);
}
