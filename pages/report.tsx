import React, { useState } from "react";
import { useRouter } from "next/router";

const ReportPage: React.FC = () => {
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const { blogId, commentId } = router.query;

  // Determine if the report is for a blog or comment
  const isBlogReport = blogId !== undefined;
  const isCommentReport = commentId !== undefined;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();


    if (!description) {
      setError("Please provide a description.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const reportUrl = isBlogReport
    ? `/api/report?blogId=${blogId}`
    : `/api/report?commentId=${commentId}`;

    try {
      const response = await fetch(reportUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          description,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Thank you for your report. It has been submitted.");
        router.push(isBlogReport ? `/blog/${blogId}` : `/blogs`);
      } else {
        setError(data.message || "An error occurred while submitting your reports.");
      }
    } catch (error) {
      setError("An error occurred while submitting your report.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        Report {isBlogReport ? "Blog" : "Comment"}
      </h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          className={styles.textarea}
          placeholder="Describe the issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: "max-w-md mx-auto p-5 text-center",
  heading: "text-2xl mb-5",
  form: "flex flex-col gap-4",
  textarea: "w-full h-40 p-3 rounded-lg border border-gray-300 text-base resize-none",
  submitButton: "px-5 py-2 bg-blue-600 text-white rounded-md text-base transition-colors hover:bg-blue-800",
  error: "text-red-600 text-sm",
};

// const styles = {
//   container: {
//     maxWidth: "600px",
//     margin: "0 auto",
//     padding: "20px",
//     textAlign: "center",
//   },
//   heading: {
//     fontSize: "2rem",
//     marginBottom: "20px",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "15px",
//   },
//   textarea: {
//     width: "100%",
//     height: "150px",
//     padding: "10px",
//     borderRadius: "8px",
//     border: "1px solid #ccc",
//     fontSize: "16px",
//   },
//   submitButton: {
//     padding: "10px 20px",
//     backgroundColor: "#0056b3",
//     color: "white",
//     border: "none",
//     borderRadius: "5px",
//     cursor: "pointer",
//     fontSize: "16px",
//     transition: "background-color 0.3s",
//   },
//   error: {
//     color: "red",
//     fontSize: "14px",
//   },

export default ReportPage;
