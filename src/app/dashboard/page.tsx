export default function DashboardPage() {
    return (
        <div style={{ paddingBottom: "2rem" }}>
            <header style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "white", marginBottom: "0.5rem" }}>
                        Dashboard
                    </h1>
                    <p style={{ color: "var(--text-muted)" }}>Overview of your content performance.</p>
                </div>
                <button className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
                    + New Post
                </button>
            </header>

            {/* Stats Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1.5rem",
                marginBottom: "2.5rem"
            }}>
                {/* Stat Card 1 */}
                <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "12px" }}>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Total Posts</div>
                    <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>1,284</div>
                    <div style={{ fontSize: "0.75rem", color: "#4ade80", marginTop: "0.25rem" }}>+12% from last month</div>
                </div>

                {/* Stat Card 2 */}
                <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "12px" }}>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Media Assets</div>
                    <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>3,405</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>2.4 GB Used</div>
                </div>

                {/* Stat Card 3 */}
                <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "12px" }}>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Active Users</div>
                    <div style={{ fontSize: "2rem", fontWeight: "bold", color: "white" }}>892</div>
                    <div style={{ fontSize: "0.75rem", color: "#4ade80", marginTop: "0.25rem" }}>+5% new users</div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "16px" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1.5rem", color: "white" }}>Recent Activity</h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "1rem",
                            background: "rgba(255,255,255,0.03)",
                            borderRadius: "8px",
                            border: "1px solid rgba(255,255,255,0.05)"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "8px",
                                    background: "#1e293b",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1.25rem"
                                }}>
                                    📄
                                </div>
                                <div>
                                    <div style={{ fontWeight: 500, color: "white" }}>Updated "Future of AI"</div>
                                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>2 hours ago by Francisco</div>
                                </div>
                            </div>
                            <div style={{
                                padding: "0.25rem 0.75rem",
                                borderRadius: "20px",
                                background: "rgba(6, 182, 212, 0.1)",
                                color: "#67e8f9",
                                fontSize: "0.75rem",
                                fontWeight: 500
                            }}>
                                Published
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
