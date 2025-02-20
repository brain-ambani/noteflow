export default function Home() {
  return (
    <div>
      This is the landing page
      <div>
        <p className="text-sm mt-2">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
