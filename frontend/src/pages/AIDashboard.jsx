import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AIDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [overview, setOverview] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [loadingConclusion, setLoadingConclusion] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [typedOverview, setTypedOverview] = useState("");
  const [typedConclusion, setTypedConclusion] = useState("");
  const [copiedText, setCopiedText] = useState("");

const handleCopy = (text, type) => {
  navigator.clipboard.writeText(text);
  setCopiedText(type);

  setTimeout(() => setCopiedText(""), 1500);
};
  const typeText = (text, setter, speed = 20) => {
    let index = 0;

    setter(""); // reset

    const interval = setInterval(() => {
      setter(text.slice(0, index + 1)); // ✅ FIX HERE
      index++;

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);
  };

  // 🔥 TOGGLE (IMPORTANT)
  const USE_MOCK = false;

  // 🔥 MOCK DATA
  const mockOverview = `Ignite2k26 is the annual full-day cultural fest of Smt. Indira Gandhi College of Engineering, designed to unite the student community
in a dynamic celebration of artistic expression and inventive spirit. This premier event showcases a diverse array of student talent through captivating stage performances, challenging competitive events, and numerous hands-on, interactive activities. It serves as a vibrant platform for creativity, encouraging collaboration and lively engagement across various disciplines. From music and dance to literary arts and technical challenges, the fest fosters a holistic environment for personal growth and collective enjoyment.
Ultimately, Ignite2k26 aims to create an unforgettable experience  that strengthens campus community bonds while highlighting the multifaceted abilities of its participants. The event Ignite2k26 was executed with a well-structured plan and efficient resource management. A dedicated team of volunteers ensured smooth coordination throughout the event. The allocated budget was utilized effectively to meet all logistical requirements. The event
plan was followed systematically, ensuring timely execution of all activities. Overall, the event was successfully conducted and achieved its intended objectives.`;

  const mockConclusion = `In conclusion, Ignite2k26 successfully achieved its mandate by
establishing an engaging platform that showcased the exceptional
talent within Smt. Indira Gandhi College of Engineering. The event
witnessed robust student participation and yielded outstanding
competitive outcomes across diverse artistic performances and
collaborative workshops. These collective efforts substantially
strengthened institutional camaraderie while providing lasting
developmental opportunities for every attendee. Ultimately, the
fest fostered a profound legacy of creative excellence that will
continue to inspire future academic initiatives and campus
traditions. In conclusion, the event Ignite2k26 proved to be a
successful initiative that met its intended objectives. The
participation, planning, and execution reflected strong
coordination and teamwork. The event created a valuable platform
for learning, interaction, and practical exposure. Overall, it left a
positive impact on all participants and demonstrated effective
event management.
`;
const mocksubeventOverview = `Indoor Ignite operates as a structured segment of Ignite2k26, featuring a curated series of interactive
competitions designed to enhance collaborative engagement among students. Participants engage in
carefully organized indoor challenges, including Man vs Food, strategic Treasure Hunt expeditions, and
precision games such as Jenga. Each activity emphasizes collective problemsolving, creative thinking,
and sustained participation within a dynamic yet professionally managed venue. The program balances
competitive structure with recreational interaction, providing a cohesive platform for students to refine
interpersonal dynamics and demonstrate strategic cooperation. This thoughtfully facilitated series
ensures seamless execution while advancing the broader developmental objectives of the annual festival.
The sub-event played a significant role in enhancing participant engagement and interaction. Participants
gained valuable insights and hands-on experience through this segment.`
const mockSubEvents = [
  {
    _id: "1",
    eventName: "Indoor Ignite",
    description: mocksubeventOverview,
    image: null,
    images: [],
  },
];
  useEffect(() => {
    fetchEvent();
  }, [id]);
  const fetchSubEvents = async (subEventIds) => {
    try {
      const requests = subEventIds.map((id) => API.get(`/subevents/${id}`));

      const responses = await Promise.all(requests);

      const fullSubEvents = responses.map((res) => res.data.data || res.data);

      return fullSubEvents;
    } catch (err) {
      console.log("Error fetching subevents:", err);
      return [];
    }
  };
  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${id}/full-data`);

      let eventData = res.data.data || res.data;

      // 🔥 CHECK IF subEvents are IDs
      if (USE_MOCK) {
  eventData.subEvents = mockSubEvents;
} else {
  if (eventData.subEvents && typeof eventData.subEvents[0] === "string") {
    const fullSubEvents = await fetchSubEvents(eventData.subEvents);
    eventData.subEvents = fullSubEvents;
  }
}
      setEvent(eventData);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (event) {
      console.log("Final subEvents:", event.subEvents);
    }
  }, [event]);
  // 🔥 FOOTER BRANDING
  const addBranding = (doc) => {
    const h = doc.internal.pageSize.height;
    const w = doc.internal.pageSize.width;

    doc.setFontSize(9);
    doc.setTextColor(249, 115, 22);
    doc.text("Made with IntelliVent", w - 10, h - 10, { align: "right" });
  };

  // 🔥 SECTION HEADER
  const section = (doc, title) => {
    // 🔥 TOP MARGIN (push heading down)
    const topY = 30; // ⬅️ was ~22 → now more space

    // HEADING
    doc.setFontSize(30);
    doc.setTextColor(0);
    doc.setFont(undefined, "bold");

    doc.text(title, 10, topY);

    // 🔥 UNDERLINE (slightly below heading)
    const lineY = topY + 4;

    doc.setLineWidth(1);
    doc.setDrawColor(0);
    doc.line(10, lineY, 200, lineY);

    // 🔥 RESET FONT
    doc.setFont(undefined, "normal");

    // 🔥 RETURN START POSITION FOR CONTENT
    return lineY + 12; // ⬅️ bottom margin (important)
  };
  const subEventStockLines = [
    "The sub-event played a significant role in enhancing participant engagement and interaction.",
    "It contributed effectively to the overall success of the event by encouraging active involvement.",
    "The structured activities ensured a smooth flow and meaningful participation throughout the session.",
    "Participants gained valuable insights and hands-on experience through this segment.",
    "The sub-event successfully complemented the main event by adding depth and practical exposure.",
  ];
  const addStockLines = (text) => {
    const shuffled = [...subEventStockLines].sort(() => 0.5 - Math.random());

    // pick 2–3 random lines
    const selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 2);

    return text + " " + selected.join(" ");
  };
  // 🔥 OVERVIEW BUTTON
  const generateOverview = async () => {
    setLoadingOverview(true);
    setTypedOverview(""); // reset

    let result = "";

    if (USE_MOCK) {
      result = mockOverview;
    } else {
      const res = await API.post(`/ai/generate`, {
        type: "overview",
        eventName: event.eventName,
        description: event.description,
      });

      result = res.data.text;
    }

    setLoadingOverview(false);

    // 🔥 START TYPING EFFECT
    typeText(result, setTypedOverview, 15);
  };

  // 🔥 CONCLUSION BUTTON
  const generateConclusion = async () => {
    setLoadingConclusion(true);
    setTypedConclusion("");

    let result = "";

    if (USE_MOCK) {
      result = mockConclusion;
    } else {
      const res = await API.post(`/ai/generate`, {
        type: "conclusion",
        eventName: event.eventName,
        description: event.description,
      });

      result = res.data.text;
    }

    setLoadingConclusion(false);

    typeText(result, setTypedConclusion, 15);
  };
  const ThinkingDots = () => (
    <div className="flex gap-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
    </div>
  );
  const generateSubEventOverview = async (sub) => {
    try {
      const res = await API.post("/ai/generate", {
        type: "subevent",
        eventName: sub.eventName,
        description: sub.description,
      });

      return res.data.text;
    } catch (err) {
      console.log(err);
      return sub.description || "No description";
    }
  };
  const cleanAIText = (text) => {
    return text
      .replace(/Here is.*?:/gi, "")
      .replace(/Key elements.*?:/gi, "")
      .replace(/\*/g, "")
      .replace(/[-•]/g, "")
      .replace(/\n+/g, " ")
      .trim();
  };
  const generateAllSubEventOverviews = async () => {
    const updated = await Promise.all(
      event.subEvents.map(async (sub) => {
        const aiText = await generateSubEventOverview(sub);

        return {
          ...sub,
          aiOverview: addStockLines(cleanAIText(aiText)), // 🔥 ADD HERE
        };
      }),
    );

    return updated;
  };

  // 🔥 PDF GENERATION
  const generatePDF = async () => {
    try {
      setLoadingPDF(true);
      setErrorMsg("");
      setCurrentStep("Generating Event Overview...");
      setProgress(10);
      let overviewText, conclusionText;

      if (USE_MOCK) {
        overviewText = mockOverview;
        conclusionText = mockConclusion;
      } else {
        const overviewRes = await API.post(`/ai/generate`, {
          type: "overview",
          eventName: event.eventName,
          description: event.description,
        });
        overviewText = overviewRes.data.text;
        setCurrentStep("Generating Conclusion...");
        setProgress(25);

        const conclusionRes = await API.post(`/ai/generate`, {
          type: "conclusion",
          eventName: event.eventName,
          description: event.description,
        });

        conclusionText = conclusionRes.data.text;
        setCurrentStep("Generating Sub-Event Insights...");
        setProgress(40);
      }

      // 🔥 SUBEVENT DETAILS
      const subEventDetails = [];

      for (let sub of event.subEvents || []) {
        if (USE_MOCK) {
          subEventDetails.push({
            name: sub.eventName,
            text: "This sub-event focused on student participation and collaborative activities.",
          });
        } else {
          const res = await API.post(`/ai/generate`, {
            type: "overview",
            eventName: sub.eventName,
            description: sub.description || "",
          });

          subEventDetails.push({
            name: sub.eventName,
            text: res.data.text,
          });
        }
      }
      setCurrentStep("Generating Sub-Event Insights...");
      setProgress(40);
      const subEventsWithAI = await generateAllSubEventOverviews();
      setCurrentStep("Preparing Document Layout...");
      setProgress(60);

      const doc = new jsPDF();
      // 🔥 COVER PAGE UPDATED

      const w = doc.internal.pageSize.width;
      const h = doc.internal.pageSize.height;

      // EVENT REPORT (TOP)
      doc.setFontSize(20);
      doc.setTextColor(80);
      doc.setFont(undefined, "normal");
      doc.text("EVENT REPORT", w / 2, 30, { align: "center" });

      // 🔥 EVENT NAME (BIGGER + BOLD)
      doc.setFontSize(48); // ⬅️ increased
      doc.setTextColor(0);
      doc.setFont(undefined, "bold");

      const eventNameY = h / 2 - 10;
      doc.text(event.eventName, w / 2, eventNameY, { align: "center" });

      // 🔥 UNDERLINE
      const textWidth =
        (doc.getStringUnitWidth(event.eventName) * 48) /
        doc.internal.scaleFactor;

      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(
        w / 2 - textWidth / 2,
        eventNameY + 4,
        w / 2 + textWidth / 2,
        eventNameY + 4,
      );

      // DATE & VENUE
      doc.setFontSize(18);
      doc.setTextColor(100);
      doc.setFont(undefined, "normal");

      doc.text(`Date: ${event.eventDate}`, w / 2, h / 2 + 25, {
        align: "center",
      });

      doc.text(`Venue: ${event.venue}`, w / 2, h / 2 + 40, {
        align: "center",
      });

      // 🔥 UPDATED BRANDING (SLIGHTLY BIGGER)
      doc.setFontSize(11); // ⬅️ increased from 9
      doc.setTextColor(249, 115, 22);
      doc.text("Made with IntelliVent", w - 10, h - 10, {
        align: "right",
      });

      doc.addPage();

      // 🔥 PAGE 2 (OVERVIEW)

      const startY = section(doc, "Event Overview"); // 👈 correct start

      doc.setFontSize(17);
      doc.setTextColor(0);

      const splitText = doc.splitTextToSize(overviewText, 175);

      let yText = startY; // 👈 NOT hardcoded

      splitText.forEach((line) => {
        doc.text(line, 10, yText);
        yText += 9;
      });
      addBranding(doc);
      doc.addPage();
      setCurrentStep("Rendering Images & Tables...");
      setProgress(80);
      // 🔥 NEW PAGE FOR BUDGET

      const budgetStartY = section(doc, "Budget Details");

      autoTable(doc, {
        startY: budgetStartY,

        head: [["Item", "Amount"]],
        body: event.budget?.map((b) => [b.item, `Rs.${b.amount}`]) || [],

        // 🔥 MAIN STYLES
        styles: {
          fontSize: 11,
          cellPadding: 6,
          textColor: [0, 0, 0],

          // 🔥 BORDER SETTINGS
          lineColor: [0, 0, 0], // black borders
          lineWidth: 0.2, // thin clean lines
        },

        // 🔥 HEADER STYLE
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: "bold",

          lineWidth: 0.3, // slightly thicker for header
        },

        // 🔥 BODY STYLE
        bodyStyles: {
          lineWidth: 0.2,
        },

        // 🔥 REMOVE LIGHT BACKGROUND (OPTIONAL CLEAN LOOK)
        alternateRowStyles: {
          fillColor: [255, 255, 255], // white rows
        },

        // 🔥 TABLE BORDER
        tableLineColor: [0, 0, 0],
        tableLineWidth: 0.3,

        didDrawPage: () => addBranding(doc),
      });
      // 🔥 NEW PAGE FOR VOLUNTEERS
      // 🔥 NO doc.addPage() HERE ❌

      doc.addPage(); // ✅ ONLY ONCE HERE (after budget completes)

      const volunteerStartY = section(doc, "Volunteers");

      autoTable(doc, {
        startY: volunteerStartY,

        head: [["Name", "Role", "Department"]],
        body:
          event.volunteers?.map((v) => [
            v.name || "-",
            v.role || "-",
            v.department || "-",
          ]) || [],

        styles: {
          fontSize: 11,
          cellPadding: 6,
          lineColor: [0, 0, 0],
          lineWidth: 0.2,
        },

        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },

        tableWidth: "auto", // 🔥 IMPORTANT

        didDrawPage: () => addBranding(doc),
      });

      // 🔥 SUB EVENTS SECTION
      // 🔥 ONLY RUN IF SUBEVENTS EXIST
      if (subEventsWithAI && subEventsWithAI.length > 0) {
        doc.addPage();

        let y = section(doc, "Sub Events");

        subEventsWithAI.forEach((sub, index) => {
          if (y > 260) {
            doc.addPage();
            y = section(doc, "Sub Events");
          }

          // 🔥 TITLE
          doc.setFont(undefined, "bold");
          doc.setFontSize(14);
          doc.text(`${index + 1}. ${sub.eventName}`, 10, y);
          y += 8;

          // 🔥 DESCRIPTION
          doc.setFont(undefined, "normal");
          doc.setFontSize(11);

          const splitText = doc.splitTextToSize(
            sub.aiOverview || sub.description || "No description",
            180,
          );

          splitText.forEach((line) => {
            if (y > 280) {
              doc.addPage();
              y = 20;
            }

            doc.text(line, 10, y);
            y += 6;
          });

          y += 10;
        });

        addBranding(doc);
      }
      // 🔥 IMAGE GALLERY PAGE
      doc.addPage();

      let yImg = section(doc, "Event Gallery");

      // 🔥 COMBINE IMAGES (event + subevents)
      const mainImages = event.images || [];

      const subEventImages =
        event.subEvents?.flatMap((sub) => {
          // case 1: single image
          if (sub.image) return [sub.image];

          // case 2: multiple images
          if (sub.images && Array.isArray(sub.images)) return sub.images;

          return [];
        }) || [];

      const allImages = [...mainImages, ...subEventImages];

      // 🔥 CONVERT URL → BASE64
      const getBase64FromUrl = async (url) => {
        try {
          const res = await fetch(url);
          const blob = await res.blob();

          return await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        } catch (err) {
          console.log("Image load error:", err);
          return null;
        }
      };

      // 🔥 CONVERT ALL IMAGES
      const imagesBase64 = (
        await Promise.all(allImages.map((img) => getBase64FromUrl(img)))
      ).filter(Boolean);

      // 🔥 GRID SETTINGS
      const imgWidth = 85;
      const imgHeight = 60;

      let x = 10;

      // 🔥 LOOP THROUGH IMAGES
      imagesBase64.forEach((img, index) => {
        try {
          // 🔥 NEW ROW AFTER 2 IMAGES
          if (index % 2 === 0 && index !== 0) {
            yImg += imgHeight + 10;
            x = 10;
          }

          // 🔥 PAGE BREAK
          if (yImg + imgHeight > 280) {
            doc.addPage();
            yImg = section(doc, "Event Gallery");
            x = 10;
          }

          // 🔥 ADD IMAGE
          doc.addImage(img, "JPEG", x, yImg, imgWidth, imgHeight);

          // 🔥 OPTIONAL BORDER (clean look)
          doc.setDrawColor(200);
          doc.rect(x, yImg, imgWidth, imgHeight);

          // 🔥 MOVE RIGHT
          x += imgWidth + 10;
        } catch (err) {
          console.log("Render error:", err);
        }
      });

      // 🔥 FOOTER
      addBranding(doc);
      // 🔥 NEW PAGE
      doc.addPage();

      // 🔥 USE SECTION (LIKE OVERVIEW)
      let yConclusion = section(doc, "Conclusion");

      // 🔥 TEXT SETTINGS (MATCH OVERVIEW)
      doc.setFontSize(17);
      doc.setTextColor(0);

      // 🔥 SPLIT TEXT PROPERLY
      const splitConclusion = doc.splitTextToSize(conclusionText, 175);

      // 🔥 WRITE TEXT WITH SPACING
      splitConclusion.forEach((line) => {
        doc.text(line, 10, yConclusion);
        yConclusion += 9; // same spacing as overview
      });

      // 🔥 FOOTER
      addBranding(doc);
      setCurrentStep("Finalizing PDF...");
      setProgress(95);

      // 🔥 CREATE PDF URL
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      // 🔥 PREVIEW
      setCurrentStep("Completed ✅");
      setProgress(100);

      setTimeout(() => {
        window.open(url);
        setLoadingPDF(false);
        setProgress(0);
      }, 500);
    } catch (err) {
      console.log(err);

      setErrorMsg(
        err?.response?.data?.message ||
          "PDF generation failed due to API load. Please try again.",
      );

      setLoadingPDF(false);
      setProgress(0);
    } finally {
      setLoadingPDF(false);
    }
  };

  if (!event) {
  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-6">

      {/* HEADER */}
      <div className="flex justify-between mb-8">

        <div>
          <div className="h-8 w-64 bg-gray-800/70 animate-pulse [animation-duration:2s] rounded mb-3"></div>

          <div className="h-4 w-40 bg-gray-800/70 animate-pulse [animation-duration:2s] rounded"></div>
        </div>

        <div className="h-10 w-24 bg-gray-800/70 animate-pulse [animation-duration:2s] rounded"></div>

      </div>

      {/* MAIN CARD */}
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">

        {/* BUTTONS */}
        <div className="flex gap-4 mb-6">

          <div className="h-10 w-44 bg-gray-800/70 animate-pulse [animation-duration:2s] rounded"></div>

          <div className="h-10 w-48 bg-gray-800/70 animate-pulse [animation-duration:2s] rounded"></div>

        </div>

        {/* PDF BUTTON */}
        <div className="h-12 w-full bg-gray-800/70 animate-pulse [animation-duration:2s] rounded"></div>

      </div>

      {/* OUTPUT CARDS */}
      <div className="mt-6 space-y-4">

        {[1, 2].map((item) => (
          <div
            key={item}
            className="bg-gray-900 p-4 rounded border border-gray-800"
          >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">

              <div className="h-5 w-32 bg-gray-800/70 animate-pulse [animation-duration:2s] rounded"></div>

              <div className="h-8 w-8 bg-gray-800/70 animate-pulse [animation-duration:2s] rounded"></div>

            </div>

            {/* TEXT */}
            <div className="space-y-3">

              <div className="h-4 w-full bg-gray-800/70 animate-pulse [animation-duration:2s] rounded"></div>

              <div className="h-4 w-5/6 bg-gray-800/70 animate-pulse [animation-duration:2s] rounded"></div>

              <div className="h-4 w-4/6 bg-gray-800/70 animate-pulse [animation-duration:2s] rounded"></div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-6">
      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-orange-600">AI Dashboard</h1>
          <p className="text-gray-400">{event.eventName}</p>
        </div>

        <button
          onClick={() => navigate(`/event/${id}`)}
          className="bg-orange-600 px-4 py-2 rounded"
        >
          Back
        </button>
      </div>

      {/* CARD */}
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <div className="flex gap-4 mb-4">
          <button
            onClick={generateOverview}
            className="bg-green-600 px-4 py-2 rounded"
          >
            {loadingOverview ? "Generating..." : "Generate Overview"}
          </button>

          <button
            onClick={generateConclusion}
            className="bg-blue-600 px-4 py-2 rounded"
          >
            {loadingConclusion ? "Generating..." : "Generate  Conclusion"}
          </button>
        </div>

        {loadingPDF ? (
          <div className="bg-gray-800 p-4 rounded w-full">
            {/* 🔥 STEP TEXT */}
            <p className="text-sm text-gray-300 mb-2">{currentStep}</p>

            {/* 🔥 PROGRESS BAR */}
            <div className="w-full bg-gray-700 h-3 rounded overflow-hidden">
              <div
                className="h-3 bg-orange-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <button
            onClick={generatePDF}
            className="bg-orange-600 px-6 py-3 rounded w-full hover:bg-orange-700"
          >
            Generate PDF 🚀
          </button>
        )}
        {errorMsg && (
          <div className="mt-4 bg-red-900/40 border border-red-500 text-red-300 p-3 rounded">
            ❌ {errorMsg}
          </div>
        )}
      </div>

      {/* OUTPUT */}
      <div className="mt-6 space-y-4">
        {/* OVERVIEW */}
{(loadingOverview || typedOverview) && (
  <div className="bg-gray-900 p-4 rounded min-h-[80px] border border-gray-800 relative">

    {/* 🔥 HEADER */}
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-green-400 font-semibold">● Overview</h3>

      {!loadingOverview && typedOverview && (
        <button
  onClick={() => handleCopy(typedOverview, "overview")}
  className="relative group p-2 rounded hover:bg-gray-800 transition"
>
  {/* TOOLTIP */}
  <span className="absolute -top-8 right-0 bg-gray-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
    {copiedText === "overview" ? "Copied!" : "Copy"}
  </span>

  {/* CLIPBOARD ICON */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`w-5 h-5 transition ${
      copiedText === "overview"
        ? "text-orange-500"
        : "text-gray-400 group-hover:text-white"
    }`}
  >
    <rect x="9" y="2" width="6" height="4" rx="1" />
    <path d="M9 4H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2h-2" />
  </svg>
</button>
      )}
    </div>

    {/* CONTENT */}
    {loadingOverview ? (
      <ThinkingDots />
    ) : (
      <p className="whitespace-pre-wrap text-gray-200">
        {typedOverview}
        <span className="animate-pulse">|</span>
      </p>
    )}
  </div>
)}
        {/* CONCLUSION */}
{(loadingConclusion || typedConclusion) && (
  <div className="bg-gray-900 p-4 rounded min-h-[80px] border border-gray-800 relative">

    {/* 🔥 HEADER */}
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-blue-400 font-semibold">● Conclusion</h3>

      {!loadingConclusion && typedConclusion && (
        <button
  onClick={() => handleCopy(typedConclusion, "conclusion")}

  className="relative group p-2 rounded hover:bg-gray-800 transition"
>
  {/* TOOLTIP */}
  <span className="absolute -top-8 right-0 bg-gray-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
    {copiedText === "overview" ? "Copied!" : "Copy"}
  </span>

  {/* CLIPBOARD ICON */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={`w-5 h-5 transition ${
      copiedText === "conclusion"
        ? "text-orange-500"
        : "text-gray-400 group-hover:text-white"
    }`}
  >
    <rect x="9" y="2" width="6" height="4" rx="1" />
    <path d="M9 4H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2h-2" />
  </svg>
</button>      )}
    </div>

    {/* CONTENT */}
    {loadingConclusion ? (
      <ThinkingDots />
    ) : (
      <p className="whitespace-pre-wrap text-gray-200">
        {typedConclusion}
        <span className="animate-pulse">|</span>
      </p>
    )}
  </div>
)}
      </div>
    </div>
  );
}

export default AIDashboard;
