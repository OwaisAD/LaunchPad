import { ScaleLoader } from 'react-spinners'

const Loader = ({ loading }: { loading: boolean }) => {
  return (
    <ScaleLoader
      color="gray"
      height={35}
      width={5}
      radius={2}
      loading={loading}
    />
  )
}

export default Loader
