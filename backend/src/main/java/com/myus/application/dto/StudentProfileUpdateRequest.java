package com.myus.application.dto;

import jakarta.validation.constraints.Size;

/**
 * Request DTO for updating allowed student profile fields.
 *
 * Note: For mass-assignment prevention (FR-012) this DTO exposes only
 * fields a student is permitted to update themselves.
 */
public class StudentProfileUpdateRequest {

    @Size(max = 50)
    private String phone;

    @Size(max = 500)
    private String address;

    public StudentProfileUpdateRequest() {
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
