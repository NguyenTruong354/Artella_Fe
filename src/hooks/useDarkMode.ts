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
    }
    
    // Đơn giản hóa đường viền
    const borderColor = isDark 
      ? 'rgba(255, 255, 255, 0.4)' 
      : 'rgba(15, 23, 42, 0.4)';
    ripple.style.border = `1px solid ${borderColor}`;
    
    // Đơn giản hóa gradient để cải thiện hiệu suất
    const gradientLight = isSecondary
      ? 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(248,250,252,0.2) 40%, transparent 80%)';
    
    const gradientDark = isSecondary
      ? 'radial-gradient(circle, rgba(15,23,42,0.2) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(15,23,42,0.3) 0%, rgba(30,41,59,0.2) 40%, transparent 80%)';
    
    // Background có độ trong suốt nhưng đơn giản hơn
    ripple.style.background = isDark ? gradientLight : gradientDark;
    
    // Box-shadow đơn giản hơn để tăng hiệu suất
    if (!isSecondary) {
      ripple.style.boxShadow = isDark 
        ? '0 0 8px rgba(255, 255, 255, 0.1)' 
        : '0 0 8px rgba(15, 23, 42, 0.1)';
    }
    
    // Đặt transform ban đầu
    ripple.style.transform = 'translate(-50%, -50%) scale(0)';
    ripple.style.opacity = isSecondary ? '0.6' : '0.7';
    
    // Tối ưu thời gian animation để giảm lag
    const duration = isSecondary ? 600 : 800;
    const initialDelay = layerDelay * 50 + (isSecondary ? 0 : rippleIndex * 40);
    
    // Thiết lập transition - đơn giản hóa cubic-bezier để tăng hiệu suất
    ripple.style.transition = `transform ${duration}ms ease-out, opacity ${duration * 0.8}ms ease-out`;
    
    // Thêm vào container
    container.appendChild(ripple);
    
    // Sử dụng requestAnimationFrame thay vì setTimeout để tăng hiệu suất
    let frameId: number;
    
    const animateRipple = () => {
      // Tính toán scale cần thiết nhưng tối ưu hóa
      const finalScale = isSecondary 
        ? (maxDistance * 0.6) / initialSize  // Giảm kích thước sóng thứ cấp 
        : (maxDistance * 2) / initialSize;   // Đơn giản hóa phép tính
      
      // Thêm hiệu ứng ngẫu nhiên cho sóng thứ cấp nhưng đơn giản hơn
      if (isSecondary) {
        const offsetX = (Math.random() - 0.5) * 10; // Giảm offset để tránh tính toán phức tạp
        const offsetY = (Math.random() - 0.5) * 10;
        ripple.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${finalScale})`;
      } else {
        ripple.style.transform = `translate(-50%, -50%) scale(${finalScale})`;
      }
      
      ripple.style.opacity = '0';
      
      // Chỉ thêm hiệu ứng rung cho sóng chính trên thiết bị mạnh
      if (!isSecondary && window.innerWidth > 1280) {
        // Sử dụng thuộc tính animation CSS thay vì JS để tối ưu hóa
        ripple.style.animation = 'wave-wobble 1.5s ease-in-out';
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
    isDark: boolean, 
    delay: number
  ) => {
    // Giảm số lượng sóng để tăng hiệu suất
    const rippleCount = delay === 0 ? 2 : 1; // Giảm số lượng sóng
    
    for (let i = 0; i < rippleCount; i++) {
      createSingleRipple(container, x, y, maxDistance, isDark, delay, i);
    }
    
    // Giảm số lượng sóng phụ ngẫu nhiên để tránh gây lag
    if (delay === 0 && window.innerWidth > 768) { // Chỉ hiển thị sóng phụ trên màn hình lớn
      // Giảm số lượng sóng phụ từ 4 xuống 1-2 tùy theo kích thước màn hình
      const secondaryRippleCount = window.innerWidth > 1280 ? 2 : 1;
      
      for (let i = 0; i < secondaryRippleCount; i++) {
        const offset = 15 + Math.random() * 20;
        const angle = Math.random() * Math.PI * 2;
        const offsetX = x + Math.cos(angle) * offset;
        const offsetY = y + Math.sin(angle) * offset;
        
        // Sử dụng requestAnimationFrame thay cho setTimeout để tối ưu hiệu năng
        requestAnimationFrame(() => {
          createSingleRipple(
            container, 
            offsetX, 
            offsetY, 
            maxDistance * 0.5, // Giảm phạm vi lan tỏa
            isDark, 
            0, 
            i, 
            true
          );
        });
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
    }

    // Tính toán khoảng cách tối ưu - tránh tính toán phức tạp
    const maxDistance = Math.max(
      Math.hypot(clickX, clickY),
      Math.hypot(window.innerWidth - clickX, clickY),
      Math.hypot(clickX, window.innerHeight - clickY),
      Math.hypot(window.innerWidth - clickX, window.innerHeight - clickY)
    );
    
    // Giảm số lớp sóng - chỉ dùng 2 lớp thay vì 3 để tăng hiệu suất
    const layerCount = window.innerWidth < 768 ? 1 : 2;
    for (let i = 0; i < layerCount; i++) {
      createWaveRipple(waveContainer, clickX, clickY, maxDistance, isDark, i);
    }

    // Thay đổi theme luôn sau khi tạo sóng
    setIsDark(prev => !prev);
    
    // Bỏ overlay riêng biệt để giảm tạo DOM - dùng luôn sóng làm overlay
    
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

