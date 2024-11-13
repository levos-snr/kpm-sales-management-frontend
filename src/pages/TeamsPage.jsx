import React, { useState } from "react";

const TeamsPage = () => {
  const [teams, setTeams] = useState([
    { id: 1, name: "Westgate Mall", members: 5 },
    { id: 2, name: "Sarit Centre", members: 8 },
    { id: 3, name: "Village Market", members: 4 },
    { id: 4, name: "Yaya Centre", members: 6 },
    { id: 5, name: "Garden City Mall", members: 7 },
    { id: 6, name: "Two Rivers Mall", members: 3 },
    { id: 7, name: "The Hub Karen", members: 6 },
  ]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-50 text-gray-900 p-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4 tracking-tight">
          Team Management
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Manage and organize your teams efficiently.
        </p>
        <button
          className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300"
          onClick={() => alert("Open Add Team Modal")}
        >
          + Create New Team
        </button>
      </div>

      {/* Teams List Section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full max-w-6xl">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 p-6 flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">{team.name}</h2>
              <div className="text-sm font-medium text-blue-500">{team.members} members</div>
            </div>
            <p className="text-gray-500 text-base">Manage your team, edit members, and track progress.</p>
            <div className="flex justify-between items-center">
              <button
                className="text-blue-500 hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
                onClick={() => setSelectedTeam(team)}
              >
                View Details
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600 transition-all duration-300"
                onClick={() => alert("Edit Team")}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Team Details Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative transform transition-all duration-500 scale-105">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              onClick={() => setSelectedTeam(null)}
            >
              ✕
            </button>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              {selectedTeam.name} - Details
            </h3>
            <div className="space-y-6">
              <p className="text-lg text-gray-600">
                This is where you manage the members and track the team&apos;s performance.
              </p>
              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300">
                  Add Member
                </button>
                <button className="w-full bg-gray-100 text-gray-900 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300">
                  Edit Team
                </button>
                <button className="w-full bg-red-500 text-white py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300">
                  Terminate Team
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;

