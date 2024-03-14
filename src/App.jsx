import { toast } from "sonner";
import "./App.css";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Loader } from "./components/Loader";

const getTodos = async () => {
  return await fetch("https://jsonplaceholder.typicode.com/todos").then((res) => res.json())
}

const getPosts = async () => {
  return await fetch("https://jsonplaceholder.typicode.com/posts").then((res) => res.json())
}

const addPost = async (newPost) => {
  return await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(newPost),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then((res) => res.json())
}

function App() {

  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    // staleTime: 6000,
  });

  const id = data?.[0]?.id
  // Dependent queries
  const { data: todoData, isLoading: todoLoading, error: todoError } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,

    // refetchOnWindowFocus: false,
    // retry: 2,
    enabled: !!id,
  });

  const { mutate, isLoading: isPending, isError, isSuccess } = useMutation({
    mutationFn: (newPost) => addPost(newPost),
      // onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
      onSuccess: (newPost) => queryClient.setQueryData(['posts'], (oldPosts) => [...oldPosts, newPost]),
      onError: (error) => toast.error(error.message)
  });

  if (isLoading) return <Loader />;
  if (error) return toast.error(error);

  return (
    <section className="max-w-7xl w-full mx-auto py-20 px-4">
      <button
        onClick={() =>
          mutate({
            userId: 20222,
            id: 22222,
            title: "Lorem ipsum dolor sit",
            body: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Optio, reiciendis.",
          })
        }
        disabled={isPending}
        className="bg-black text-white rounded-md px-4 py-2 mb-10"
      >
        {isPending ? "Adding Post...": "Add Post"}
      </button>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-col-2 grid-cols-1 gap-5">
        {!isLoading &&
          data &&
          data.length > 0 &&
          data.map((todo) => (
            <div key={todo.id} className="bg-neutral-200 py-3 px-5 rounded-lg">
              <span>{todo.title}</span>
            </div>
          ))}
      </div>
    </section>
  );
}

export default App;
