'use client';

import { useEffect, useState } from 'react';
import { getEthereumContract } from '@/lib/ethereum';
import ConnectButton from '@/components/ConnectButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

type Task = {
  id: number;
  content: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState('');

  const loadTasks = async () => {
    if (!window.ethereum) return;
    try {
      setFetching(true);
      const contract = await getEthereumContract();
      const result = await contract.getAllTasks();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsed = result.map((t: any) => ({
        id: Number(t.id),
        content: t.content,
        completed: t.completed,
        createdAt: t.createdAt.toString(),
        updatedAt: t.updatedAt.toString(),
      }));

      setTasks(parsed);
    } catch (err) {
      console.error('Error loading tasks', err);
    } finally {
      setFetching(false);
    }
  };

  const addTask = async () => {
    if (!newTask) return;
    setLoading(true);
    try {
      const contract = await getEthereumContract();
      const tx = await contract.createTask(newTask);
      await tx.wait();
      setNewTask('');
      loadTasks();
    } catch (err) {
      console.error('Error adding task', err);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId: number) => {
    setLoading(true);
    try {
      const contract = await getEthereumContract();
      const tx = await contract.completeTask(taskId);
      await tx.wait();
      loadTasks();
    } catch (err) {
      console.error('Error completing task', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: number) => {
    setLoading(true);
    try {
      const contract = await getEthereumContract();
      const tx = await contract.deleteTask(taskId);
      await tx.wait();
      loadTasks();
    } catch (err) {
      console.error('Error deleting task', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId: number) => {
    if (!editedContent) return;
    setLoading(true);
    try {
      const contract = await getEthereumContract();
      const tx = await contract.updateTask(taskId, editedContent);
      await tx.wait();
      setEditingTaskId(null);
      setEditedContent('');
      loadTasks();
    } catch (err) {
      console.error('Error updating task', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <main className='p-6 max-w-xl mx-auto space-y-6'>
      <h1 className='text-3xl font-bold'>📝 To-Do DApp</h1>

      <ConnectButton />

      <div className='flex gap-2'>
        <Input
          placeholder='Add a new task...'
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          disabled={loading}
        />
        <Button onClick={addTask} disabled={loading || !newTask}>
          {loading ? <Loader2 className='animate-spin' /> : 'Add'}
        </Button>
      </div>

      {fetching ? (
        <div className='space-y-2'>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className='h-16 w-full rounded-xl' />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <p className='text-muted-foreground'>No tasks yet</p>
      ) : (
        <div className='space-y-4'>
          {tasks.map(task => (
            <Card key={task.id}>
              <CardContent className='flex justify-between items-center py-4'>
                <div className='flex-1'>
                  {editingTaskId === task.id ? (
                    <div className='flex gap-2'>
                      <Input
                        value={editedContent}
                        onChange={e => setEditedContent(e.target.value)}
                        disabled={loading}
                      />
                      <Button
                        onClick={() => updateTask(task.id)}
                        disabled={loading || !editedContent}
                        className='bg-blue-500 hover:bg-blue-600'
                      >
                        {loading ? (
                          <Loader2 className='animate-spin' />
                        ) : (
                          'Save'
                        )}
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingTaskId(null);
                          setEditedContent('');
                        }}
                        variant='secondary'
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p
                        className={
                          task.completed
                            ? 'line-through text-muted-foreground'
                            : ''
                        }
                      >
                        {task.content}
                      </p>

                      <div className='text-xs text-muted-foreground'>
                        Updated:{' '}
                        {new Date(
                          Number(task.updatedAt) * 1000,
                        ).toLocaleString()}
                      </div>

                      {task.completed && (
                        <Badge variant='secondary' className='mt-1'>
                          Completed
                        </Badge>
                      )}
                    </>
                  )}
                </div>

                {editingTaskId !== task.id && (
                  <div className='space-x-2'>
                    {!task.completed && (
                      <Button
                        size='sm'
                        onClick={() => completeTask(task.id)}
                        disabled={loading}
                        className='bg-green-500 hover:bg-green-600'
                      >
                        ✅
                      </Button>
                    )}

                    {!task.completed && (
                      <Button
                        size='sm'
                        onClick={() => {
                          setEditingTaskId(task.id);
                          setEditedContent(task.content);
                        }}
                        disabled={loading}
                        className='bg-yellow-500 hover:bg-yellow-600'
                      >
                        ✏️
                      </Button>
                    )}

                    <Button
                      size='sm'
                      onClick={() => deleteTask(task.id)}
                      disabled={loading}
                      className='bg-red-500 hover:bg-red-600'
                    >
                      🗑
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
