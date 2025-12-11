package com.opticalshop.controller;

import com.opticalshop.dto.ApiResponse;
import com.opticalshop.dto.AggregateFieldResult;
import com.opticalshop.dto.CommonPayload;
import com.opticalshop.dto.PageResponse;
import com.opticalshop.dto.Pagination;
import com.opticalshop.dto.StatusInfo;
import com.opticalshop.dto.UserDto;
import com.opticalshop.model.Product;
import com.opticalshop.model.User;
import com.opticalshop.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin Management", description = "APIs for admin operations including user and product management")
public class AdminController {

    private final UserRepository userRepository;
    private final com.opticalshop.repository.OrderRepository orderRepository;
    private final com.opticalshop.repository.ProductRepository productRepository;
    private final com.opticalshop.repository.PrescriptionRepository prescriptionRepository;

    @PostMapping("/users")
    @Operation(summary = "List all users with pagination", description = "Retrieves a paginated list of all users in the system with their details including ID, username, email, and roles. Requires ADMIN role.")
    public ApiResponse<UserDto> listUsers(@RequestBody CommonPayload payload) {
        Pagination pageRequest = payload.getPagination();
        Pageable pageable = PageRequest.of(pageRequest.getCurrentPage() - 1, pageRequest.getPerPage()); // PageRequest
                                                                                                        // is 0-based
        Page<User> userPage = userRepository.findAll(pageable);
        List<UserDto> userDtos = userPage.getContent().stream().map(this::toDto).collect(Collectors.toList());

        // Create pagination response
        Pagination pagination = new Pagination();
        pagination.setCurrentPage(userPage.getNumber() + 1); // Convert back to 1-based for response
        pagination.setPerPage(userPage.getSize());
        pagination.setTotalPages(userPage.getTotalPages());
        pagination.setTotalRecords((int) userPage.getTotalElements());

        // Placeholder for aggregate fields (can be implemented based on requirements)
        List<AggregateFieldResult> aggregateFields = List.of(); // Empty for now

        // Create status info
        StatusInfo status = new StatusInfo();
        status.setTimeStamp(java.time.Instant.now().toString());
        status.setStatus(200);
        status.setUserMessage("Success");
        status.setMessage("Users retrieved successfully");

        // Generate unique ID
        String uniqueId = java.util.UUID.randomUUID().toString();

        return new ApiResponse<>(uniqueId, userDtos, pagination, aggregateFields, status);
    }

    @PostMapping("/users/{id}/block")
    @Operation(summary = "Block a user account", description = "Disables a user account by setting their enabled status to false. This prevents the user from logging in. Requires ADMIN role.")
    public ResponseEntity<?> blockUser(@PathVariable Long id) {
        return userRepository.findById(id).map(u -> {
            u.setEnabled(false);
            userRepository.save(u);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete a user account", description = "Permanently removes a user from the system by their ID. This action cannot be undone. Requires ADMIN role.")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> u = userRepository.findById(id);
        if (u.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Unlink orders to prevent foreign key constraint violation
        List<com.opticalshop.model.Order> orders = orderRepository.findByUserId(id);
        for (com.opticalshop.model.Order order : orders) {
            order.setUser(null);
            orderRepository.save(order);
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{id}/role")
    @Operation(summary = "Update user role", description = "Changes the role assignment for a specific user. Accepts a role parameter to set the new role (e.g., ROLE_ADMIN, ROLE_USER). Returns the updated user details. Requires ADMIN role.")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestParam String role) {
        Optional<User> u = userRepository.findById(id);
        if (u.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = u.get();
        user.setRoles(new java.util.HashSet<>(java.util.Collections.singletonList(role)));
        userRepository.save(user);
        return ResponseEntity.ok(toDto(user));
    }

    @PostMapping("/discounts/apply")
    @Operation(summary = "Apply discount to product", description = "Applies a discount to a product by adjusting its price. This is a placeholder endpoint for discount management functionality. Requires ADMIN role.")
    public ResponseEntity<?> applyDiscount(@RequestBody Product p) {
        // placeholder: real discount management would apply discounts to persisted
        // products
        p.setPrice(p.getPrice());
        return ResponseEntity.ok().build();
    }

    private UserDto toDto(User u) {
        UserDto d = new UserDto();
        d.setId(u.getId());
        d.setUsername(u.getUsername());
        d.setEmail(u.getEmail());
        d.setRoles(u.getRoles());
        return d;
    }
    @GetMapping("/dashboard-stats")
    @Operation(summary = "Get dashboard statistics", description = "Retrieves aggregated statistics for the admin dashboard including revenue and sales data.")
    public ResponseEntity<com.opticalshop.dto.DashboardStatsDto> getDashboardStats() {
        List<com.opticalshop.model.Order> allOrders = orderRepository.findAll();
        long totalUsers = userRepository.count();

        // Filter valid orders (e.g., ignore cancelled)
        List<com.opticalshop.model.Order> validOrders = allOrders.stream()
                .filter(o -> !"CANCELLED".equalsIgnoreCase(o.getStatus()))
                .collect(Collectors.toList());

        double totalRevenue = validOrders.stream()
                .map(o -> o.getTotalAmount() != null ? o.getTotalAmount().doubleValue() : 0.0)
                .reduce(0.0, Double::sum);

        // Monthly Sales (Last 12 months logic could be added, here taking all time for simplicity as per MVP)
        Map<String, Double> monthlySales = validOrders.stream()
                .filter(o -> o.getOrderDate() != null)
                .collect(Collectors.groupingBy(
                        o -> o.getOrderDate().getMonth().toString() + "-" + o.getOrderDate().getYear(),
                        Collectors.summingDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount().doubleValue() : 0.0)
                ));

        // Sales by Category
        Map<String, Double> salesByCategory = validOrders.stream()
                .flatMap(o -> o.getOrderItems().stream())
                .filter(i -> i.getProduct() != null && i.getProduct().getCategory() != null)
                .collect(Collectors.groupingBy(
                        i -> i.getProduct().getCategory(),
                        Collectors.summingDouble(i -> i.getUnitPrice() != null ? i.getUnitPrice().doubleValue() * i.getQuantity() : 0.0)
                ));

        // Weekly Sales (Trend by Day Access Last 3 Months)
        LocalDateTime threeMonthsAgo = LocalDateTime.now().minusMonths(3);
        Map<String, Double> weeklySales = validOrders.stream()
                .filter(o -> o.getOrderDate() != null && o.getOrderDate().isAfter(threeMonthsAgo))
                .collect(Collectors.groupingBy(
                        o -> o.getOrderDate().getDayOfWeek().toString(),
                        Collectors.summingDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount().doubleValue() : 0.0)
                ));

        // New Logic
        List<Product> lowStock = productRepository.findByStockQuantityLessThan(5); // Alert if < 5
        Map<String, Long> ordersByStatus = allOrders.stream()
            .collect(Collectors.groupingBy(o -> o.getStatus() != null ? o.getStatus() : "UNKNOWN", Collectors.counting()));
        List<Product> topSelling = orderRepository.findTopSellingProducts(PageRequest.of(0, 5));

        com.opticalshop.dto.DashboardStatsDto stats = com.opticalshop.dto.DashboardStatsDto.builder()
                .totalRevenue(totalRevenue)
                .totalOrders((long) allOrders.size()) // Show all orders count
                .totalUsers(totalUsers)
                .monthlySales(monthlySales)
                .weeklySales(weeklySales)
                .salesByCategory(salesByCategory)
                .lowStockProducts(lowStock)
                .ordersByStatus(ordersByStatus)
                .topSellingProducts(topSelling)
                .build();

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/prescriptions")
    @Operation(summary = "Get all prescriptions", description = "Retrieves all user prescriptions.")
    public ResponseEntity<List<com.opticalshop.model.Prescription>> getAllPrescriptions() {
        return ResponseEntity.ok(prescriptionRepository.findAll());
    }

    @GetMapping("/reports/export")
    @Operation(summary = "Export sales report", description = "Downloads a CSV file of all orders.")
    public ResponseEntity<org.springframework.core.io.Resource> exportReport() {
        List<com.opticalshop.model.Order> orders = orderRepository.findAll();
        StringBuilder csv = new StringBuilder("Order ID,Date,User,Status,Total Amount,Items\n");
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy");

        for (com.opticalshop.model.Order order : orders) {
            csv.append(order.getId()).append(",");
            csv.append(order.getOrderDate() != null ? order.getOrderDate().format(formatter) : "N/A").append(",");
            csv.append(order.getUser() != null ? order.getUser().getUsername() : "N/A").append(",");
            csv.append(order.getStatus()).append(",");
            csv.append(order.getTotalAmount()).append(",");
            csv.append(order.getOrderItems().size()).append("\n");
        }

        org.springframework.core.io.ByteArrayResource resource = new org.springframework.core.io.ByteArrayResource(csv.toString().getBytes());

        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=sales_report.csv")
                .contentType(org.springframework.http.MediaType.parseMediaType("text/xlsx"))
                .body(resource);
    }
}
