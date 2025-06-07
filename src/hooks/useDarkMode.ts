import { useState, useEffect } from 'react';

interface DarkModeHook {
  isDark: boolean;
  isTransitioning: boolean;
  toggleTheme: (e?: React.MouseEvent) => void;
}

const useDarkMode = (): DarkModeHook => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      const initialDark = saved ? JSON.parse(saved) : false;
      
      // Immediately apply the initial state to DOM
      const documentElement = document.documentElement;
      if (initialDark) {
        documentElement.classList.add('dark');
      } else {
        documentElement.classList.remove('dark');
      }
      
      return initialDark;
    }
    return false;
  });
  
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(isDark));
      
      // Immediately apply/remove dark class
      const documentElement = document.documentElement;
      if (isDark) {
        documentElement.classList.add('dark');
      } else {
        documentElement.classList.remove('dark');
      }
    }
  }, [isDark]);

  const createSingleRipple = (
    container: HTMLElement,
    x: number,
    y: number,
    maxDistance: number,
    isDark: boolean,
    layerDelay: number,
    rippleIndex: number,
    isSecondary = false
  ) => {
    const ripple = document.createElement('div');
    
    // Sử dụng class CSS có sẵn để tận dụng GPU và tối ưu hóa
    ripple.className = `wave-ripple-enhanced ${isSecondary ? 'wave-ripple-secondary' : ''}`;
    
    // Vị trí ban đầu
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    // Kích thước ban đầu - đơn giản hóa để tăng hiệu suất
    const initialSize = isSecondary ? 12 : 15 + rippleIndex * 3;
    ripple.style.width = initialSize + 'px';
    ripple.style.height = initialSize + 'px';
    
    // Giảm hiệu ứng blur tốn tài nguyên
    if (!isSecondary) {
      ripple.style.filter = 'blur(0.5px)';
    }    // Tăng độ rõ cho đường viền
    const borderColor = isDark 
      ? 'rgba(255, 255, 255, 0.85)' // Tăng độ rõ từ 0.7 lên 0.85
      : 'rgba(15, 23, 42, 0.85)';   // Tăng độ rõ từ 0.7 lên 0.85
    ripple.style.border = `${isSecondary ? '1px' : '2px'} solid ${borderColor}`; // Tăng độ dày từ 1.5px lên 2px
    
    // Tăng độ rõ cho gradient nhưng vẫn giữ đơn giản để không gây lag
    const gradientLight = isSecondary
      ? 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 75%)' // Tăng từ 0.3 lên 0.5
      : 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(248,250,252,0.4) 40%, transparent 80%)'; // Tăng từ 0.4/0.3 lên 0.6/0.4
    
    const gradientDark = isSecondary
      ? 'radial-gradient(circle, rgba(15,23,42,0.5) 0%, transparent 75%)' // Tăng từ 0.3 lên 0.5
      : 'radial-gradient(circle, rgba(15,23,42,0.6) 0%, rgba(30,41,59,0.4) 40%, transparent 80%)'; // Tăng từ 0.4/0.3 lên 0.6/0.4
    
    // Background có độ trong suốt tăng lên nhẹ
    ripple.style.background = isDark ? gradientLight : gradientDark;
      // Tăng đáng kể độ rõ cho box-shadow
    if (!isSecondary) {
      ripple.style.boxShadow = isDark 
        ? '0 0 15px 4px rgba(255, 255, 255, 0.25)' // Tăng size và độ đậm rõ hơn
        : '0 0 15px 4px rgba(15, 23, 42, 0.25)';   // Tăng size và độ đậm rõ hơn
    } else {
      // Thêm shadow nhẹ cho sóng thứ cấp để tăng độ rõ
      ripple.style.boxShadow = isDark
        ? '0 0 8px 2px rgba(255, 255, 255, 0.15)'
        : '0 0 8px 2px rgba(15, 23, 42, 0.15)';
    }
    
    // Đặt transform ban đầu
    ripple.style.transform = 'translate(-50%, -50%) scale(0)';
    ripple.style.opacity = isSecondary ? '0.7' : '0.85'; // Tăng opacity từ 0.6/0.7 lên 0.7/0.85
      // Tối ưu thời gian animation để giảm lag nhưng đủ thời gian thấy rõ hiệu ứng
    const duration = isSecondary ? 700 : 900; // Tăng thời gian hiển thị nhẹ để thấy rõ hơn
    const initialDelay = layerDelay * 40 + (isSecondary ? 0 : rippleIndex * 30); // Giảm delay để hiệu ứng hiển thị nhanh hơn
    
    // Thiết lập transition - sử dụng cubic-bezier nhưng vẫn tối ưu hiệu suất
    ripple.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${duration * 0.8}ms ease-out`;
    
    // Thêm vào container
    container.appendChild(ripple);
    
    // Sử dụng requestAnimationFrame thay vì setTimeout để tăng hiệu suất
    let frameId: number;
    
    const animateRipple = () => {    // Tính toán scale cần thiết nhưng tối ưu hóa - giảm kích thước để không che màn hình
      const finalScale = isSecondary 
        ? (maxDistance * 0.3) / initialSize  // Giảm kích thước sóng thứ cấp xuống 30%
        : (maxDistance * 0.8) / initialSize;   // Giảm kích thước sóng chính xuống 80%
      
      // Thêm hiệu ứng ngẫu nhiên cho sóng thứ cấp nhưng đơn giản hơn
      if (isSecondary) {
        const offsetX = (Math.random() - 0.5) * 10; // Giảm offset để tránh tính toán phức tạp
        const offsetY = (Math.random() - 0.5) * 10;
        ripple.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${finalScale})`;
      } else {
        ripple.style.transform = `translate(-50%, -50%) scale(${finalScale})`;
      }
      
      ripple.style.opacity = '0';      // Nâng cấp hiệu ứng trên các loại thiết bị với nhiều lớp hiệu ứng
      if (!isSecondary) {
        // Áp dụng các hiệu ứng khác nhau tùy theo kích thước thiết bị
        if (window.innerWidth > 1280) {
          // Màn hình lớn - sử dụng nhiều hiệu ứng kết hợp          ripple.style.animation = 'wave-wobble 1.8s ease-in-out, wave-pulse 2s ease-in-out infinite';          // Thêm hiệu ứng gợn sóng bằng backdrop-filter với hỗ trợ webkit
          ripple.style.backdropFilter = 'contrast(1.05) brightness(1.05)';
          // Dùng setProperty để thiết lập các thuộc tính không chuẩn
          ripple.style.setProperty('-webkit-backdrop-filter', 'contrast(1.05) brightness(1.05)');
          
          // Tạo hiệu ứng phát sáng (glowing effect)
          const glowColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.15)';
          ripple.style.boxShadow = `0 0 15px 5px ${glowColor}, 0 0 30px 10px ${glowColor}`;
          
        } else if (window.innerWidth > 768) {          // Màn hình trung bình - sử dụng hiệu ứng vừa phải          ripple.style.animation = 'wave-pulse 2s ease-in-out';          ripple.style.backdropFilter = 'contrast(1.03)';
          // Dùng setProperty để thiết lập các thuộc tính không chuẩn
          ripple.style.setProperty('-webkit-backdrop-filter', 'contrast(1.03)');
          
          // Hiệu ứng phát sáng nhẹ hơn
          const glowColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.12)';
          ripple.style.boxShadow = `0 0 10px 3px ${glowColor}`;
          
        } else {
          // Màn hình nhỏ - sử dụng hiệu ứng tối giản nhưng vẫn rõ nét
          ripple.style.filter = 'contrast(1.3) brightness(1.05)'; // Tăng tương phản và độ sáng
          
          // Thêm viền rõ nét hơn để thấy trên thiết bị nhỏ
          ripple.style.borderWidth = '2.5px';
          
          // Thêm độ sáng
          const glowColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(15, 23, 42, 0.2)';
          ripple.style.boxShadow = `0 0 8px 2px ${glowColor}`;
        }
        
        // Thêm class CSS để hỗ trợ hiệu ứng nổi bật
        ripple.classList.add('wave-ripple-main');
      } else {
        // Cho các sóng thứ cấp thêm hiệu ứng nhẹ
        ripple.style.filter = 'brightness(1.1)';
      }
    };
    
    // Sử dụng requestAnimationFrame để đồng bộ với refresh rate màn hình
    if (initialDelay === 0) {
      frameId = requestAnimationFrame(animateRipple);
    } else {
      setTimeout(() => {
        frameId = requestAnimationFrame(animateRipple);
      }, initialDelay);
    }
    
    // Xóa ripple sau khi animation hoàn tất
    setTimeout(() => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      ripple.remove();
    }, duration + initialDelay + 50);
  };
    // Hàm tạo hiệu ứng sóng lan tỏa (đã tối ưu để giảm lag)
  const createWaveRipple = (
    container: HTMLElement, 
    x: number, 
    y: number, 
    maxDistance: number, 
    isDark: boolean,    delay: number
  ) => {
    // Giảm số lượng sóng để tăng hiệu suất và tránh che phủ quá nhiều
    const rippleCount = delay === 0 ? 1 : 1; // Giảm số lượng sóng xuống chỉ còn 1
      for (let i = 0; i < rippleCount; i++) {
      createSingleRipple(container, x, y, maxDistance, isDark, delay, i);
    }
    
    // Tối ưu hóa số lượng sóng phụ và tăng tính tự nhiên
    if (delay === 0 && window.innerWidth > 768) { // Chỉ hiển thị sóng phụ trên màn hình lớn
      // Điều chỉnh số lượng sóng phụ theo kích thước màn hình - giảm để tránh che phủ
      const secondaryRippleCount = window.innerWidth > 1280 ? 2 : (window.innerWidth > 1024 ? 1 : 1); // Giảm từ 3-2-1 xuống 2-1-1
      
      // Tạo mảng các góc để phân phối đều các sóng phụ xung quanh
      const angles = Array.from({length: secondaryRippleCount}, (_, i) => 
        (Math.PI * 2 * i / secondaryRippleCount) + (Math.random() * 0.5 - 0.25)
      );
      
      for (let i = 0; i < secondaryRippleCount; i++) {
        // Tăng offset và đa dạng hóa khoảng cách
        const offset = 20 + Math.random() * 25;
        const angle = angles[i]; // Sử dụng góc đã phân phối
        const offsetX = x + Math.cos(angle) * offset;
        const offsetY = y + Math.sin(angle) * offset;
        
        // Delay nhẹ giữa các sóng phụ để tạo hiệu ứng tự nhiên
        const secondaryDelay = i * 50;
        
        setTimeout(() => {
          // Đảm bảo chạy mượt với requestAnimationFrame
          requestAnimationFrame(() => {            createSingleRipple(
              container, 
              offsetX, 
              offsetY, 
              maxDistance * 0.35, // Giảm phạm vi lan tỏa từ 0.6 xuống 0.35
              isDark, 
              0, 
              i, 
              true
            );
          });
        }, secondaryDelay);
      }
        // Thêm 1 sóng phụ nhỏ hơn với độ trễ cao hơn nếu màn hình đủ lớn - giảm số lượng
      if (window.innerWidth > 1440) {
        setTimeout(() => {
          const microRippleCount = 1; // Giảm từ 2 xuống 1
          for (let i = 0; i < microRippleCount; i++) {
            const microOffset = 10 + Math.random() * 15;
            const microAngle = Math.random() * Math.PI * 2;
            const microX = x + Math.cos(microAngle) * microOffset;
            const microY = y + Math.sin(microAngle) * microOffset;
            
            requestAnimationFrame(() => {              createSingleRipple(
                container, 
                microX, 
                microY, 
                maxDistance * 0.25, // Giảm kích thước micro ripple xuống 25%
                isDark, 
                0, 
                0, 
                true
              );
            });
          }
        }, 150); // Delay sau sóng chính để tạo hiệu ứng phản xạ
      }
    }
  };
  const toggleTheme = (e?: React.MouseEvent) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    let clickX = window.innerWidth / 2;
    let clickY = window.innerHeight / 2;
    
    if (e) {
      clickX = e.clientX;
      clickY = e.clientY;
    }

    // Tạo container cho hiệu ứng sóng lan tỏa - sử dụng một container cho tất cả
    let waveContainer = document.querySelector('.wave-container') as HTMLElement;
    if (!waveContainer) {
      waveContainer = document.createElement('div');
      waveContainer.className = 'wave-container';
      document.body.appendChild(waveContainer);
    } else {
      // Nếu đã có container, xóa tất cả con cũ
      waveContainer.innerHTML = '';
    }    // Tính toán khoảng cách tối ưu - giảm tỷ lệ để không che phủ toàn màn hình
    const maxDistance = Math.max(
      Math.hypot(clickX, clickY),
      Math.hypot(window.innerWidth - clickX, clickY),
      Math.hypot(clickX, window.innerHeight - clickY),
      Math.hypot(window.innerWidth - clickX, window.innerHeight - clickY)
    ) * 0.6; // Giảm từ 1.1 xuống 0.6 để chỉ che phủ 60% màn hình
      // Điều chỉnh số lớp sóng theo kích thước thiết bị - giảm số lượng để tránh che phủ
    const layerCount = window.innerWidth < 768 ? 1 : (window.innerWidth < 1280 ? 1 : 2); // Giảm từ 2-3 xuống 1-2 lớp
    for (let i = 0; i < layerCount; i++) {
      createWaveRipple(waveContainer, clickX, clickY, maxDistance, isDark, i);
    }

    // Thay đổi theme luôn sau khi tạo sóng
    setIsDark(prev => !prev);
  

    // Cleanup với thời gian ngắn hơn
    setTimeout(() => {
      setIsTransitioning(false);
      
      // Không xóa container nhưng xóa hết nội dung của nó
      if (waveContainer) {
        waveContainer.innerHTML = '';
      }
    }, 800); // Giảm thời gian từ 1200ms xuống 800ms
  };

  return {
    isDark,
    isTransitioning,
    toggleTheme,
  };
};

export default useDarkMode;