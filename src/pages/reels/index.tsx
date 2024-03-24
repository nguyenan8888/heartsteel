/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// ** Apis
import { reelApi } from 'src/@core/apis'
import toast from 'react-hot-toast'
import Box from '@mui/system/Box';
import ListReel from 'src/@core/components/list-reel';
import Fab from '@mui/material/Fab'
import Icon from 'src/@core/components/icon'

const Reels = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [listReel, setListReel] = useState<any>()
  const [loading, setLoading] = useState(true);
  const [totalPage, setTotalPage] = useState<any>()
  const [page, setPage] = useState<number>(1)
  const [isLiked, setIsLiked] = useState(false)
  const router = useRouter();

  useEffect(() => {
    if (!page) return;
    fetchData(page);
  }, [page]);
  
  // const handleScroll = (event: any) => {
  //   const deltaY = event.deltaY;
  //   const scrollHeight = event.target.scrollHeight;
  //   const clientHeight = event.target.clientHeight;
  //   const quarterScroll = scrollHeight / 5;
  //   // Xử lý sự kiện lăn chuột
  //   if (event.deltaY > 0 && page < totalPage && Math.abs(deltaY) > quarterScroll) {
  //     setPage(page+1)
  //   } else if (event.deltaY < 0 && page > 1) {
  //     setPage(page-1)
  //   }
  // };

  const handleKeyDown = (event: any) => {
    if (event.key === 'ArrowUp' && page > 1) {
      setPage(page-1)
    } else if (event.key === 'ArrowDown' && page < totalPage) {
      setPage(page+1)
    }
  };

  useEffect(() => {
    // window.addEventListener('wheel', handleScroll);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      // window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [page]);


  const fetchData = async (page: number) => {
    reelApi
    .reel(page)
    .then(({ data }) => {
      setListReel(data.data.reels)
      setTotalPage(data.data.totalPage)
      setIsLiked(data.data.reels.isLiked)
      router.push({
        pathname: router.pathname,
        query: { ...router.query, id: data.data.reels._id },
      });
    })
    .catch(err => {
      toast.error(err)
    })
    .finally(() => {
      setLoading(false);

      return;
    })
  };

  return (
    <div style={{width:'100%'}}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Box style={{display:'flex', justifyContent: 'space-between', alignItems: 'center', width:'100%'}}>
          <div>
            <Fab disabled={page === 1} onClick={() => setPage(page-1)} color='primary' aria-label='add' size='large'>
              <Icon icon='ic:outline-navigate-before' />
            </Fab>
          </div>
          <ListReel listData={listReel} fetch={()=>fetchData(page)} liked={isLiked}/>
          <div>
            <Fab disabled={page === totalPage} onClick={() => setPage(page+1)} color='primary' aria-label='add' size='large'>
              <Icon icon='ic:outline-navigate-next' />
            </Fab>
          </div>
        </Box>
      )}
    </div>
  );
}

export default Reels;
