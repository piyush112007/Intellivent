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

  const [loadingOverview, setLoadingOverview] = useState(false);
  const [loadingConclusion, setLoadingConclusion] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);

  // 🔥 TOGGLE (IMPORTANT)
  const USE_MOCK = false;

  // 🔥 MOCK DATA
  const mockOverview = `Tech Fest is a premier college-level event focused on coding and robotics. 
It provides students with opportunities to participate in competitions, workshops, and collaborative projects. 
The event encourages innovation, teamwork, and real-world problem solving.`;

  const mockConclusion = `The event was successfully conducted with proper planning and coordination. 
Participants actively engaged in all activities, and the event achieved its objective of promoting learning and collaboration.`;

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
      if (eventData.subEvents && typeof eventData.subEvents[0] === "string") {
        const fullSubEvents = await fetchSubEvents(eventData.subEvents);

        eventData.subEvents = fullSubEvents;
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

    if (USE_MOCK) {
      setOverview(mockOverview);
    } else {
      const res = await API.post(`/ai/generate`, {
        type: "overview",
        eventName: event.eventName,
        description: event.description,
      });
      setOverview(res.data.text);
    }

    setLoadingOverview(false);
  };

  // 🔥 CONCLUSION BUTTON
  const generateConclusion = async () => {
    setLoadingConclusion(true);

    if (USE_MOCK) {
      setConclusion(mockConclusion);
    } else {
      const res = await API.post(`/ai/generate`, {
        type: "conclusion",
        eventName: event.eventName,
        description: event.description,
      });
      setConclusion(res.data.text);
    }

    setLoadingConclusion(false);
  };
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

        const conclusionRes = await API.post(`/ai/generate`, {
          type: "conclusion",
          eventName: event.eventName,
          description: event.description,
        });

        overviewText = overviewRes.data.text;
        conclusionText = conclusionRes.data.text;
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
      const subEventsWithAI = await generateAllSubEventOverviews();

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
      // 🔥 PREVIEW
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingPDF(false);
    }
  };

  if (!event)
    return <h1 className="text-white text-center mt-10">Loading...</h1>;

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

        <button
          onClick={generatePDF}
          className="bg-purple-600 px-6 py-3 rounded w-full"
        >
          {loadingPDF ? "Generating..." : "Generate PDF 🚀"}
        </button>
      </div>

      {/* OUTPUT */}
      <div className="mt-6 space-y-4">
        {overview && <div className="bg-gray-900 p-4 rounded">{overview}</div>}
        {conclusion && (
          <div className="bg-gray-900 p-4 rounded">{conclusion}</div>
        )}
      </div>
    </div>
  );
}

export default AIDashboard;
