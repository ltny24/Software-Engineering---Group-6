package com.myus.service;

import com.myus.dto.GradeResponse;

import java.util.List;

public interface GradeService {

    List<GradeResponse> getMyGrades(String username);
}
