import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import StudentNavbar from "./StudentNavbar";

const LearnCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progress, setProgress] = useState(0);
  const [watchedProgress, setWatchedProgress] = useState({});

  const playerRefs = useRef({});
  const trackingRefs = useRef({});
  const watchDataRefs = useRef({});

  const studentId = localStorage.getItem("userId");

  const getWatchKey = (lessonId) =>
    `skillhub-watch-${studentId || "guest"}-${id}-${lessonId}`;

  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        return Promise.resolve();
      }

      if (window.youtubeApiPromise) {
        return window.youtubeApiPromise;
      }

      window.youtubeApiPromise = new Promise((resolve) => {
        window.onYouTubeIframeAPIReady = () => {
          resolve();
        };

        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.body.appendChild(script);
      });

      return window.youtubeApiPromise;
    };

    loadYouTubeAPI();

    axios
      .get(`${import.meta.env.VITE_API_URL}/lesson/course/${id}`)
      .then((res) => {
        setLessons(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    if (!studentId) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/enrollment/my-courses/${studentId}`)
      .then((res) => {
        const enrollment = res.data.find(
          (item) => String(item.courseId) === String(id)
        );

        if (enrollment) {
          setProgress(Math.min(enrollment.progress, 100));
          setCompletedLessons(enrollment.completedLessons || []);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, studentId]);

  useEffect(() => {
    if (lessons.length === 0) return;

    const createPlayers = () => {
      lessons.forEach((lesson) => {
        if (playerRefs.current[lesson._id]) return;

        const videoId = getVideoId(lesson.videoUrl);

        if (!videoId) return;

        playerRefs.current[lesson._id] = new window.YT.Player(
          `youtube-player-${lesson._id}`,
          {
            videoId,
            playerVars: {
              playsinline: 1,
              rel: 0,
              controls: 1
            },
            events: {
              onReady: (event) => {
                const player = event.target;
                const duration = player.getDuration();

                let savedData = null;

                try {
                  savedData = JSON.parse(
                    localStorage.getItem(getWatchKey(lesson._id))
                  );
                } catch (error) {
                  console.log(error);
                }

                const savedWatchedSeconds = savedData
                  ? Math.max(Number(savedData.watchedSeconds) || 0, 0)
                  : 0;

                const savedResumePosition = savedData
                  ? Math.max(Number(savedData.resumePosition) || 0, 0)
                  : 0;

                const watchedSeconds = Math.min(
                  savedWatchedSeconds,
                  duration
                );

                const resumePosition = Math.min(
                  savedResumePosition,
                  duration
                );

                watchDataRefs.current[lesson._id] = {
                  watchedSeconds,
                  lastTime: resumePosition,
                  resumePosition,
                  duration,
                  lastWallTime: Date.now()
                };

                const percentage =
                  duration > 0
                    ? Math.min(
                        Math.round((watchedSeconds / duration) * 100),
                        100
                      )
                    : 0;

                setWatchedProgress((prev) => ({
                  ...prev,
                  [lesson._id]: percentage
                }));

                if (
                  resumePosition > 0 &&
                  resumePosition < duration - 1
                ) {
                  player.seekTo(resumePosition, true);
                }
              },

              onStateChange: (event) => {
                if (
                  event.data === window.YT.PlayerState.PLAYING
                ) {
                  startTracking(lesson._id, event.target);
                } else if (
                  event.data === window.YT.PlayerState.ENDED
                ) {
                  handleVideoEnded(lesson._id, event.target);
                  stopTracking(lesson._id);
                } else {
                  saveWatchData(lesson._id, event.target);
                  stopTracking(lesson._id);
                }
              }
            }
          }
        );
      });
    };

    const waitForYouTube = () => {
      if (window.YT && window.YT.Player) {
        setTimeout(createPlayers, 100);
      } else {
        setTimeout(waitForYouTube, 100);
      }
    };

    waitForYouTube();

    return () => {
      Object.keys(playerRefs.current).forEach((lessonId) => {
        const player = playerRefs.current[lessonId];

        if (player) {
          saveWatchData(lessonId, player);
        }
      });

      Object.values(trackingRefs.current).forEach((interval) => {
        clearInterval(interval);
      });

      Object.values(playerRefs.current).forEach((player) => {
        if (player && player.destroy) {
          player.destroy();
        }
      });

      playerRefs.current = {};
      trackingRefs.current = {};
      watchDataRefs.current = {};
    };
  }, [lessons]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      Object.keys(playerRefs.current).forEach((lessonId) => {
        const player = playerRefs.current[lessonId];

        if (player) {
          saveWatchData(lessonId, player);
        }
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const getVideoId = (url) => {
    if (!url) return null;

    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.hostname.includes("youtube.com")) {
        if (parsedUrl.pathname.startsWith("/embed/")) {
          return parsedUrl.pathname.split("/embed/")[1].split("/")[0];
        }

        if (parsedUrl.pathname === "/watch") {
          return parsedUrl.searchParams.get("v");
        }
      }

      if (parsedUrl.hostname === "youtu.be") {
        return parsedUrl.pathname.substring(1).split("/")[0];
      }
    } catch (error) {
      console.log(error);
    }

    return null;
  };

  const updateWatchedPercentage = (lessonId, data) => {
    const percentage =
      data.duration > 0
        ? Math.min(
            Math.round((data.watchedSeconds / data.duration) * 100),
            100
          )
        : 0;

    setWatchedProgress((prev) => ({
      ...prev,
      [lessonId]: percentage
    }));
  };

  const saveWatchData = (lessonId, player) => {
    try {
      const data = watchDataRefs.current[lessonId];

      if (!data || !player) return;

      const currentTime = player.getCurrentTime();
      const duration = player.getDuration();

      if (duration && duration > 0) {
        data.duration = duration;
      }

      if (
        typeof currentTime === "number" &&
        currentTime >= 0
      ) {
        data.resumePosition = Math.min(
          currentTime,
          data.duration
        );
      }

      data.watchedSeconds = Math.min(
        Math.max(data.watchedSeconds, 0),
        data.duration
      );

      localStorage.setItem(
        getWatchKey(lessonId),
        JSON.stringify({
          watchedSeconds: data.watchedSeconds,
          resumePosition: data.resumePosition,
          duration: data.duration
        })
      );

      updateWatchedPercentage(lessonId, data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVideoEnded = (lessonId, player) => {
    try {
      const data = watchDataRefs.current[lessonId];

      if (!data || !player) return;

      const duration = player.getDuration();

      if (duration && duration > 0) {
        data.duration = duration;
        data.watchedSeconds = duration;
        data.resumePosition = duration;
        data.lastTime = duration;
      }

      localStorage.setItem(
        getWatchKey(lessonId),
        JSON.stringify({
          watchedSeconds: data.watchedSeconds,
          resumePosition: data.resumePosition,
          duration: data.duration
        })
      );

      setWatchedProgress((prev) => ({
        ...prev,
        [lessonId]: 100
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const startTracking = (lessonId, player) => {
    stopTracking(lessonId);

    if (!watchDataRefs.current[lessonId]) {
      watchDataRefs.current[lessonId] = {
        watchedSeconds: 0,
        lastTime: player.getCurrentTime(),
        resumePosition: player.getCurrentTime(),
        duration: player.getDuration(),
        lastWallTime: Date.now()
      };
    }

    const data = watchDataRefs.current[lessonId];

    data.lastTime = player.getCurrentTime();
    data.lastWallTime = Date.now();

    trackingRefs.current[lessonId] = setInterval(() => {
      try {
        if (
          !player ||
          !player.getCurrentTime ||
          !player.getDuration
        ) {
          return;
        }

        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        const playbackRate =
          player.getPlaybackRate
            ? player.getPlaybackRate()
            : 1;

        if (!duration || duration <= 0) return;

        const difference = currentTime - data.lastTime;
        const wallTimeDifference =
          (Date.now() - data.lastWallTime) / 1000;

       
        const expectedDifference =
          Math.max(wallTimeDifference, 0) * playbackRate;

        const allowedDifference =
          Math.max(expectedDifference * 2.5, 1.5);

        if (
          difference >= 0 &&
          difference <= allowedDifference
        ) {
          data.watchedSeconds += difference;
        }

        data.lastTime = currentTime;
        data.resumePosition = currentTime;
        data.lastWallTime = Date.now();
        data.duration = duration;

        data.watchedSeconds = Math.min(
          Math.max(data.watchedSeconds, 0),
          duration
        );

        updateWatchedPercentage(lessonId, data);

        localStorage.setItem(
          getWatchKey(lessonId),
          JSON.stringify({
            watchedSeconds: data.watchedSeconds,
            resumePosition: data.resumePosition,
            duration: data.duration
          })
        );
      } catch (error) {
        console.log(error);
      }
    }, 250);
  };

  const stopTracking = (lessonId) => {
    if (trackingRefs.current[lessonId]) {
      clearInterval(trackingRefs.current[lessonId]);
      delete trackingRefs.current[lessonId];
    }
  };

  const completeLesson = (lessonId) => {
    const data = watchDataRefs.current[lessonId];

    if (!data || !data.duration) {
      alert("Video information is not available yet.");
      return;
    }

    const player = playerRefs.current[lessonId];

    if (player) {
      if (
        player.getPlayerState &&
        player.getPlayerState() === window.YT.PlayerState.ENDED
      ) {
        data.watchedSeconds = data.duration;
        data.resumePosition = data.duration;

        localStorage.setItem(
          getWatchKey(lessonId),
          JSON.stringify({
            watchedSeconds: data.watchedSeconds,
            resumePosition: data.resumePosition,
            duration: data.duration
          })
        );

        setWatchedProgress((prev) => ({
          ...prev,
          [lessonId]: 100
        }));
      } else {
        saveWatchData(lessonId, player);
      }
    }

    const watchedPercentage = Math.min(
      Math.round(
        (data.watchedSeconds / data.duration) * 100
      ),
      100
    );

    if (watchedPercentage < 80) {
      alert(
        `Please watch at least 80% of the video before completing this lesson. You have watched ${watchedPercentage}%.`
      );
      return;
    }

    axios
      .put(
  `${import.meta.env.VITE_API_URL}/enrollment/complete-lesson`,
        {
          studentId,
          lessonId,
          courseId: id,
          watchedPercentage
        }
      )
      .then((res) => {
        setCompletedLessons((prev) => {
          if (prev.includes(lessonId)) return prev;
          return [...prev, lessonId];
        });

        setProgress(Math.min(res.data.progress, 100));
      })
      .catch((err) => {
        console.log(err);
        alert(
          err.response?.data?.message ||
            "Failed to update progress"
        );
      });
  };

  const takeChallenge = (lessonId) => {
    navigate(`/student/quiz/${lessonId}`);
  };

  return (
    <>
      <StudentNavbar />

      <div
        className="container-fluid py-4"
        style={{
          backgroundColor: "#e0ebfc",
          minHeight: "100vh"
        }}
      >
        <div
          className="container"
          style={{ paddingTop: "50px" }}
        >
          <h2 className="mb-1">Course Lessons</h2>

          <p className="text-muted mb-4">
            Complete each lesson and track your learning progress.
          </p>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">Course Progress</h5>
                <strong>{Math.min(progress, 100)}%</strong>
              </div>

              <div
                className="progress"
                style={{ height: "9px" }}
              >
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${Math.min(progress, 100)}%`
                  }}
                >
                  {Math.min(progress, 100)}%
                </div>
              </div>
            </div>
          </div>

          {lessons.map((lesson) => {
            const watched =
              watchedProgress[lesson._id] || 0;

            const isCompleted =
              completedLessons.includes(lesson._id);

            const canComplete = watched >= 80;

            return (
              <div
                className="card mb-4 border-0 shadow-sm overflow-hidden"
                key={lesson._id}
              >
                <div className="card-body p-4">
                  <h4 className="mb-2">
                    {lesson.order}. {lesson.title}
                  </h4>

                  <p className="text-muted mb-4">
                    {lesson.description}
                  </p>

                  <div className="ratio ratio-16x9 mb-3">
                    <div
                      id={`youtube-player-${lesson._id}`}
                      style={{
                        width: "100%",
                        height: "100%"
                      }}
                    ></div>
                  </div>

                  {!isCompleted && (
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small className="text-muted">
                          Actual video watched
                        </small>

                        <small className="fw-bold">
                          {watched}%
                        </small>
                      </div>

                      <div
                        className="progress"
                        style={{ height: "8px" }}
                      >
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${watched}%`
                          }}
                        ></div>
                      </div>

                      <small className="text-muted">
                        {canComplete
                          ? "You have watched enough of the video. You can now complete this lesson."
                          : "Watch at least 80% of the video. Skipping forward does not count as watched time."}
                      </small>
                    </div>
                  )}

                  <div className="d-flex flex-wrap gap-2">
                    {isCompleted ? (
                      <button
                        className="btn btn-success"
                        disabled
                      >
                        ✓ Completed
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          completeLesson(lesson._id)
                        }
                        disabled={!canComplete}
                      >
                        {canComplete
                          ? "Mark as Completed"
                          : `Watch ${Math.max(
                              80 - watched,
                              0
                            )}% more`}
                      </button>
                    )}

                    <button
                      className="btn btn-warning"
                      onClick={() =>
                        takeChallenge(lesson._id)
                      }
                    >
                      📝 Take Challenge
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default LearnCourse;
