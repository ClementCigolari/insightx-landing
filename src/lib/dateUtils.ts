export function formatDateFR(dateString: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  }
  
  export function formatDateTimeFR(dateString: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }) +
      " à " +
      date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }