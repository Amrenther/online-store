import prisma from "@/lib/prisma";

export default async function HealthPage() {
  const healthCheck = await prisma.healthCheck.findMany();

  return (
    <div>
      <h1>Health Check</h1>
      {healthCheck.map((check: any) => (
        <div key={check.id}>
          <p>{check.message}</p>
          <p>{check.createdAt.toISOString()}</p>
        </div>
      ))}
    </div>
  );
}
