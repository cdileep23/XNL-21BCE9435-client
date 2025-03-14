import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    skills: [],
    bio: '',
    profileImage: ''
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:7000/user/profile',{withCredentials:true});
      const data = response.data;
      console.log(data)
      setUser(data);
      setFormData({
        fullName: data.fullName || '',
        skills: Array.isArray(data.skills) ? data.skills : [],
        bio: data.bio || '',
        profileImage: data.profileImage || ''
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.patch('http://localhost:7000/user/profile', formData,{withCredentials:true});
      setUser(response.data.user);
      setMessage(response.data.message);
      setIsEditing(false);
      setIsLoading(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile');
      setIsLoading(false);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-900 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-gray-700">No profile data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {message && (
          <div className="bg-blue-900 text-white p-4 text-center">
            {message}
          </div>
        )}
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <img 
                src={user.profileImage || "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              {!isEditing ? (
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-gray-600 capitalize">{user.userType}</p>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Bio</h2>
                    <p className="text-gray-700">{user.bio || 'No bio provided'}</p>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
                    {user.skills && user.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user.skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No skills listed</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    {user.userType === 'freelancer' && (
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Money Earned</p>
                        <p className="text-xl font-bold text-blue-900">₹{user.moneyEarned || 0}</p>
                      </div>
                    )}
                    {user.userType === 'jobPoster' && (
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Money Spent</p>
                        <p className="text-xl font-bold text-blue-900">₹{user.moneySpent || 0}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="bio">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="profileImage">
                      Profile Image URL
                    </label>
                    <input
                      type="text"
                      id="profileImage"
                      name="profileImage"
                      value={formData.profileImage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Skills
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.skills && formData.skills.length > 0 ? (
                        formData.skills.map((skill, index) => (
                          <div key={index} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center">
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-2 text-gray-500 hover:text-gray-800"
                            >
                              ×
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 mb-2">No skills added yet</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-900"
                        placeholder="Add a skill"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-blue-900 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 text-center text-gray-600 text-sm">
          <p>Account created on: {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;