package com.opticalshop.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Double sphLeft;
    private Double sphRight;
    private Double cylLeft;
    private Double cylRight;
    private Double axisLeft;
    private Double axisRight;
    private Double pd; // Pupillary Distance

    // New fields for prescription upload
    private String imagePath; // Path to uploaded prescription image
    private String familyMemberName; // Name of family member (self or others)
    private LocalDateTime uploadDate;
    private LocalDateTime expiryDate;

    private String doctorName;
    private LocalDateTime examDate;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (uploadDate == null) {
            uploadDate = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Double getSphLeft() { return sphLeft; }
    public void setSphLeft(Double sphLeft) { this.sphLeft = sphLeft; }
    public Double getSphRight() { return sphRight; }
    public void setSphRight(Double sphRight) { this.sphRight = sphRight; }
    public Double getCylLeft() { return cylLeft; }
    public void setCylLeft(Double cylLeft) { this.cylLeft = cylLeft; }
    public Double getCylRight() { return cylRight; }
    public void setCylRight(Double cylRight) { this.cylRight = cylRight; }
    public Double getAxisLeft() { return axisLeft; }
    public void setAxisLeft(Double axisLeft) { this.axisLeft = axisLeft; }
    public Double getAxisRight() { return axisRight; }
    public void setAxisRight(Double axisRight) { this.axisRight = axisRight; }
    public Double getPd() { return pd; }
    public void setPd(Double pd) { this.pd = pd; }
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    public LocalDateTime getExamDate() { return examDate; }
    public void setExamDate(LocalDateTime examDate) { this.examDate = examDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    // New getters and setters
    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }
    public String getFamilyMemberName() { return familyMemberName; }
    public void setFamilyMemberName(String familyMemberName) { this.familyMemberName = familyMemberName; }
    public LocalDateTime getUploadDate() { return uploadDate; }
    public void setUploadDate(LocalDateTime uploadDate) { this.uploadDate = uploadDate; }
    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }
}
