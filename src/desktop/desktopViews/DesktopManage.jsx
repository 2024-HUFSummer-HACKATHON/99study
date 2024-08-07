import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { eventsState } from "../../atom";
import PartCard from "../components/partCard";
import DesktopCreate from "./DesktopCreate";
import { doc, getDoc } from "firebase/firestore";
import { database } from "../../firebase";


export default function DesktopManage() {
  const [events, setEvents] = useRecoilState(eventsState);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teams, setTeams] = useState({});
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [currentTeam, setCurrentTeam] = useState("선택 된 팀이 없습니다.");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    major: "",
    studentId: "",
    name: "",
    phone: "",
  });

  const getPlayers = async () => {
    const docRef = doc(database, "players", "축구");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const temp = docSnap.data();
      setEvents(Object.values(temp));
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getPlayers();
    if (selectedEvent) {
      const filteredData = events.filter((item) => item[4] === selectedEvent);

      const groupedTeams = filteredData.reduce((acc, item) => {
        const teamName = item[5];

        if (!acc[teamName]) {
          acc[teamName] = [];
        }
        acc[teamName].push({
          major: item[0],
          studentId: item[1],
          name: item[2],
          phone: item[3],

        });
        return acc;
      }, {});

      setTeams(groupedTeams);
      setSelectedTeam("");
    }
  }, [selectedEvent]);


  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    setEditingPlayer(null);
  };

  const handleEditPlayer = (index) => {
    setEditingPlayer(index);
  };

  const handleSavePlayer = (index) => {
    setEditingPlayer(null);
  };

  const handleDeletePlayer = (index) => {
    setTeams((prevTeams) => {
      const updatedTeams = { ...prevTeams };
      updatedTeams[selectedTeam] = updatedTeams[selectedTeam].filter(
        (_, i) => i !== index
      );
      return updatedTeams;
    });
  };

  const handleInputChange = (e, field, index) => {
    const { value } = e.target;
    setTeams((prevTeams) => {
      const updatedTeams = { ...prevTeams };
      updatedTeams[selectedTeam][index][field] = value;
      return updatedTeams;
    });
  };

  const handleSendLink = () => {
    alert("선수 추가 링크가 전송되었습니다.");
  };

  const handleDeleteEvent = (eventName) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event[4] !== eventName)
    );

    if (selectedEvent === eventName) {
      setSelectedEvent("");
      setTeams({});
    }
  };

  const handleAddNewPlayer = () => {
    setTeams((prevTeams) => {
      const updatedTeams = { ...prevTeams };
      if (!updatedTeams[selectedTeam]) {
        updatedTeams[selectedTeam] = [];
      }
      updatedTeams[selectedTeam].push(newPlayer);
      return updatedTeams;
    });
    setNewPlayer({
      major: "",
      studentId: "",
      name: "",
      phone: "",
    });
  };

  const handleNewPlayerInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlayer((prevPlayer) => ({
      ...prevPlayer,
      [name]: value,
    }));
  };


  const renderTeamList = () => (
    <div className="team-list text-center flex flex-wrap">
      {Object.keys(teams).map((team, index) => (
        <div
          key={index}
          className="text-xl cursor-pointer m-2 border-2 rounded-xl border-pointRed px-5"
          onClick={() => {
            handleTeamClick(team);
            setCurrentTeam(team);
          }}
        >
          {team}
        </div>
      ))}
    </div>
  );

  const renderSelectedTeam = () => {
    if (selectedTeam === "") {
      return (
        <div className="">팀 정보를 보고 싶으면 팀 이름을 클릭하세요.</div>
      );
    }

    const selectedTeamData = teams[selectedTeam];

    return (
      <div className="team-details">
        <div className="text-2xl font-bold">
          현재 표시된 팀은 {currentTeam} 입니다.
        </div>


        <table className="min-w-full bg-white mt-4 table-fixed text-sm">
          <thead>
            <tr>
              <th className="py-2 w-1/12">번호</th>
              <th className="py-2 w-2/12">이름</th>
              <th className="py-2 w-2/12">학번</th>
              <th className="py-2 w-3/12">학과</th>
              <th className="py-2 w-2/12">전화번호</th>
              <th className="py-2 w-1/12">수정</th>
              <th className="py-2 w-1/12">삭제</th>
            </tr>
          </thead>
          <tbody>
            {selectedTeamData.map((participant, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">
                  {editingPlayer === index ? (
                    <input
                      type="text"
                      value={participant.name}
                      onChange={(e) => handleInputChange(e, "name", index)}
                      className="w-full"
                    />
                  ) : (
                    participant.name
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingPlayer === index ? (
                    <input
                      type="text"
                      value={participant.studentId}
                      onChange={(e) => handleInputChange(e, "studentId", index)}
                      className="w-full"
                    />
                  ) : (
                    participant.studentId
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingPlayer === index ? (
                    <input
                      type="text"
                      value={participant.major}
                      onChange={(e) => handleInputChange(e, "major", index)}
                      className="w-full"
                    />
                  ) : (
                    participant.major
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingPlayer === index ? (
                    <input
                      type="text"
                      value={participant.phone}
                      onChange={(e) => handleInputChange(e, "phone", index)}
                      className="w-full"
                    />
                  ) : (
                    participant.phone
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingPlayer === index ? (
                    <button onClick={() => handleSavePlayer(index)}>
                      저장
                    </button>
                  ) : (
                    <button onClick={() => handleEditPlayer(index)}>
                      수정
                    </button>
                  )}
                </td>
                <td className="border px-4 py-2">
                  <button onClick={() => handleDeletePlayer(index)}>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4">
          <h3 className="text-xl font-bold">새로운 선수 추가</h3>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              name="major"
              placeholder="학과"
              value={newPlayer.major}
              onChange={handleNewPlayerInputChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="studentId"
              placeholder="학번"
              value={newPlayer.studentId}
              onChange={handleNewPlayerInputChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="name"
              placeholder="이름"
              value={newPlayer.name}
              onChange={handleNewPlayerInputChange}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="phone"
              placeholder="전화번호"
              value={newPlayer.phone}
              onChange={handleNewPlayerInputChange}
              className="p-2 border rounded"
            />
            <button
              onClick={handleAddNewPlayer}
              className="bg-pointRed text-white p-2 rounded mt-2"
            >
              선수 추가
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleAddEvent = (newEvent) => {
    setEvents((prevEvents) => [
      ...prevEvents,
      ["학과명", 0, "이름", 0, "전화번호", newEvent.eventName, "팀명"],

    ]);
  };

  return (
    <div className="flex justify-start w-full">
      <div className="p-4 w-[500px] h-[100vh]">
        <div className="text-3xl font-bold mb-4 ">종목 관리</div>
        <div className="flex flex-col gap-4 h-[80%] overflow-y-scroll">

          <PartCard
            manageText="종목 상세보기"
            onClick={(eventName) => setSelectedEvent(eventName)}
            onDelete={handleDeleteEvent}
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white p-2 rounded mt-1"
        >
          종목 추가
        </button>
      </div>
      <div className="w-[800px] p-4">
        {selectedEvent ? (
          <>
            <div className="text-3xl font-bold mb-4">팀 관리</div>
            <div className="text-[35px] font-bold mb-4">{selectedEvent}</div>
            {renderTeamList()}
            {renderSelectedTeam()}
          </>
        ) : (
          <div className="text-2xl font-bold mb-4">
            보고 싶은 종목을 클릭하세요.
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white p-6 rounded-lg max-w-lg mx-auto">
            <DesktopCreate
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleAddEvent}
            />

          </div>
        </div>
      )}
    </div>
  );
}
