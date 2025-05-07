// tsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './bookmark-galaxy.module.css';

interface Bookmark {
  title: string;
  url: string;
  group: string;
}

interface BookmarkGalaxyProps {
  bookmarks: Bookmark[];
  showGroup?: boolean;
}

const BookmarkGalaxy: React.FC<BookmarkGalaxyProps> = ({
  bookmarks,
  showGroup = false
}) => {
  const [hoveredBookmark, setHoveredBookmark] = useState<Bookmark | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.005);
  const [sphereSize, setSphereSize] = useState(200);

  // 自动旋转效果
  useEffect(() => {
    let animationId: number;
    const animate = () => {
      if (autoRotate) {
        setRotation((prev) => ({
          x: prev.x,
          y: prev.y + rotationSpeed
        }));
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [autoRotate, rotationSpeed]);

  // 鼠标拖动控制球体旋转
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      setAutoRotate(false);
      container.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      setRotation((prev) => ({
        x: prev.x + deltaY * 0.01,
        y: prev.y + deltaX * 0.01
      }));

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        container.style.cursor = 'grab';
      }
    };

    const handleMouseLeave = () => {
      if (isDragging) {
        isDragging = false;
        container.style.cursor = 'grab';
        // 恢复自动旋转选项
        setTimeout(() => setAutoRotate(true), 1000);
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 添加滚轮缩放功能
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      setSphereSize((prev) => {
        const newSize = prev - delta * 0.1;
        return Math.max(100, Math.min(300, newSize)); // 限制大小范围
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const getBookmarkColor = (bookmark: Bookmark) => {
    // 基于书签分组生成稳定的颜色
    let hash = 0;
    for (let i = 0; i < (bookmark.group || bookmark.title).length; i++) {
      hash =
        (bookmark.group || bookmark.title).charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };

  const handleBookmarkClick = (url: string) => {
    window.open(url, '_blank');
  };

  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
  };

  const increaseSpeed = () => {
    setRotationSpeed((prev) => Math.min(prev + 0.002, 0.02));
  };

  const decreaseSpeed = () => {
    setRotationSpeed((prev) => Math.max(prev - 0.002, 0.001));
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0 });
    setSphereSize(200);
    setRotationSpeed(0.005);
  };

  return (
    <div>
      <div className={styles.controlsContainer}>
        <button onClick={toggleAutoRotate} className={styles.controlButton}>
          {autoRotate ? '暂停旋转' : '开始旋转'}
        </button>
        <button
          onClick={decreaseSpeed}
          className={styles.controlButton}
          disabled={rotationSpeed <= 0.001}
        >
          减速
        </button>
        <button
          onClick={increaseSpeed}
          className={styles.controlButton}
          disabled={rotationSpeed >= 0.02}
        >
          加速
        </button>
        <button onClick={resetView} className={styles.controlButton}>
          重置视图
        </button>
      </div>
      <div
        className={styles.galaxyContainer + ' ' + styles.perspective}
        ref={containerRef}
      >
        {/* 中心点标记 */}
        <div className={styles.centerPoint}></div>

        <div
          className={
            styles.galaxySphere + ' ' + styles.transformStylePreserve3d
          }
          style={{
            transform: `rotateX(${rotation.x}rad) rotateY(${rotation.y}rad)`
          }}
        >
          {bookmarks.map((bookmark, index) => {
            // 使用斐波那契分布在球体表面，确保均匀分布
            const y = 1 - (index / (bookmarks.length - 1)) * 2;
            const radius = Math.sqrt(1 - y * y);
            const theta =
              (Math.PI * (3 - Math.sqrt(5)) * index) % (2 * Math.PI);

            // 计算球面坐标
            const x = Math.cos(theta) * radius * sphereSize;
            const z = Math.sin(theta) * radius * sphereSize;
            const yPos = y * sphereSize;

            // 计算深度缩放和透明度
            const distance = Math.sqrt(x * x + yPos * yPos + z * z);
            const maxDistance = sphereSize;
            const scale = 1 - distance / (maxDistance * 1.5);
            const opacity = Math.max(0.4, scale * 1.3);
            const size = Math.max(30, 45 * scale);

            // 确定在前面还是后面
            const isInFront = z > 0;

            return (
              <div
                key={index}
                className={
                  styles.bookmarkNode + ' ' + styles.transformStylePreserve3d
                }
                style={{
                  transform: `translate3d(${x}px, ${yPos}px, ${z}px)`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: getBookmarkColor(bookmark),
                  opacity: opacity,
                  zIndex: Math.floor(z + sphereSize),
                  pointerEvents: isInFront ? 'auto' : 'none'
                }}
                onMouseEnter={() => setHoveredBookmark(bookmark)}
                onMouseLeave={() => setHoveredBookmark(null)}
                onClick={() => handleBookmarkClick(bookmark.url)}
              >
                <span className={styles.bookmarkLabel}>
                  {bookmark.title.substring(0, size > 40 ? 2 : 1)}
                </span>

                {hoveredBookmark === bookmark && (
                  <div className={styles.tooltip}>
                    <div className={styles.tooltipTitle}>{bookmark.title}</div>
                    {showGroup && bookmark.group && (
                      <div className={styles.tooltipGroup}>
                        {bookmark.group}
                      </div>
                    )}
                    <div className={styles.tooltipUrl}>{bookmark.url}</div>
                    <div
                      className={styles.tooltipButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmarkClick(bookmark.url);
                      }}
                    >
                      打开链接
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.infoText}>
        <p>拖动球体可以旋转查看更多书签，滚轮缩放，点击书签可以访问对应链接</p>
        <p>共显示 {bookmarks.length} 个书签</p>
      </div>
    </div>
  );
};

export default BookmarkGalaxy;
