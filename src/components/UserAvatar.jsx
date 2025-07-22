import React, { useState } from "react";

const getInitials = (name) => {
  if (!name) return "NN";
  const names = name.trim().split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const UserAvatar = ({ user, size = 8 }) => {
  const [imgError, setImgError] = useState(false);
  const hasPhoto = user && user.photoURL && user.photoURL.trim() !== '' && !imgError;
  const sizeClass = `w-${size} h-${size}`;
  return (
    <div className={`bg-[#7C3BEC] rounded-full flex items-center justify-center overflow-hidden ${sizeClass}`}>
      {hasPhoto ? (
        <img
          src={user.photoURL}
          alt={user.displayName || 'User'}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className={`font-bold text-white ${size <= 7 ? 'text-xs' : 'text-sm'}`}>
          {getInitials(user.displayName)}
        </span>
      )}
    </div>
  );
};

export default UserAvatar; 