package example.springboot_propagation_required_new.repository;

import example.springboot_propagation_required_new.entity.A;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ARepository extends JpaRepository<A, Long> {
}
