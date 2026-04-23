const InfoItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className='flex flex-col gap-1.5'>
      <span className='uppercase text-muted-foreground text-[9px]'>
        {label}
      </span>
      <span>{value}</span>
    </div>
  )
}

export default InfoItem
