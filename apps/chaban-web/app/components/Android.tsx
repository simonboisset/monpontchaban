type Props = {
  className?: string;
};
export const Android = ({ className }: Props) => {
  return (
    <svg viewBox='0 0 24 24' className={className} fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M10.6 6.35c0 .193-.156.349-.349.35-.194 0-.351-.157-.351-.35 0-.193.157-.35.35-.35s.35.157.35.35zm3.15-.35c-.193 0-.35.157-.35.35s.156.349.349.35c.194 0 .351-.157.351-.35s-.157-.35-.35-.35zm10.25-1v14c0 2.761-2.238 5-5 5h-14c-2.761 0-5-2.239-5-5v-14c0-2.761 2.239-5 5-5h14c2.762 0 5 2.239 5 5zm-16.9 4.829c0-.563-.487-1.03-1.05-1.029-.564-.001-1.05.466-1.05 1.03v4.274c0 .564.486.996 1.05.996.563 0 1.05-.431 1.05-.996v-4.275zm9.1-1.029h-8.4l.001 6.611c0 .603.487 1.089 1.09 1.089h.309v2.479c0 .563.494 1.021 1.057 1.021.564 0 1.043-.458 1.043-1.021v-2.479h1.4v2.479c0 .563.496 1.021 1.058 1.021.564 0 1.042-.458 1.042-1.021v-2.479h.312c.6 0 1.089-.487 1.089-1.09v-6.61zm0-.702c0-1.579-.843-2.664-2.134-3.387l.658-1.301c.034-.068.012-.154-.053-.193-.064-.037-.143-.012-.178.057l-.663 1.314c-1.071-.516-2.48-.569-3.661 0l-.664-1.315c-.034-.068-.113-.094-.177-.057-.064.039-.087.125-.052.194l.658 1.301c-1.291.723-2.134 1.809-2.134 3.387h8.4zm2.8 1.731c0-.563-.486-1.03-1.05-1.029-.563-.001-1.05.466-1.05 1.03v4.274c0 .564.486.996 1.05.996s1.05-.431 1.05-.996v-4.275z'
        fill='currentColor'
      />
    </svg>
  );
};
